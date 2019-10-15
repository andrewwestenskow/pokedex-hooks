const axios = require('axios')
const baseUrl = 'https://pokeapi.co/api/v2'
const client = require('../redisAsync')

module.exports = {
  getPokemonByName: async (req, res) => {
    const db = req.app.get('db')
    const { name } = req.params
    const pokemonUrl = `${baseUrl}/pokemon/${name}`
    const checkPokemon = await client.sismember('pokemon-set', pokemonUrl)
    if (checkPokemon === 0) {
      const { data } = await axios.get(pokemonUrl)
      const [{ pokemon_id }] = await db.add_pokemon({
        name: data.name,
        sort_order: data.order,
        height: data.height,
        weight: data.weight,
        id: data.id,
        base_experience: data.base_experience,
        url: pokemonUrl,
        species_url: `${baseUrl}/pokemon-species${data.id}`
      })

      await client.sadd('pokemon-set', pokemonUrl)

      const { front_default, front_shiny, front_female, front_shiny_female, back_default, back_shiny, back_female, back_shiny_female } = data.sprites

      await db.add_sprites({ pokemon_id, front_default, front_shiny, front_female, front_shiny_female, back_default, back_shiny, back_female, back_shiny_female })

      const abilityCheck = []

      for (let i = 0; i < data.abilities.length; i++) {
        const j = await client.sismember('ability', data.abilities[i].ability.url)
        if (j === 0) {
          abilityCheck.push(data.abilities[i])
        }
      }

      const newAbilities = await Promise.all(abilityCheck.map(async element => {
        const { url: ability } = element.ability
        const { data: abilityData } = await axios.get(ability)
        await client.sadd('ability', ability)
        return {
          id: abilityData.id,
          name: abilityData.name,
          effect: abilityData.effect_entries[0].effect,
          short_effect: abilityData.effect_entries[0].short_effect,
          url: ability
        }
      }))

      const abilitiesToAssign = await db.ability.insert(newAbilities)
      abilitiesToAssign.forEach(async element => {
        await db.assign_ability({ pokemon_id, ability_id: element.ability_id })
      })

      const moveCheck = []

      for (let i = 0; i < data.moves.length; i++) {
        const j = await client.sismember('moves', data.moves[i].move.url)
        if (j === 0) {
          moveCheck.push(data.moves[i])
        }
      }

      const newMoves = await Promise.all(moveCheck.map(async element => {
        const { url: move } = element.move
        const { data: moveData } = await axios.get(move)
        await client.sadd('moves', move)
        return {
          url: move,
          id: moveData.id,
          name: moveData.name,
          accuracy: moveData.accuracy,
          effect_chance: moveData.effect_chance,
          pp: moveData.pp,
          power: moveData.power,
          damage_class: moveData.damage_class.name,
          type: moveData.type.name,
          effect: moveData.effect_entries[0].effect,
          short_effect: moveData.effect_entries[0].short_effect,
          ailment: moveData.meta.ailment.name,
          crit_rate: moveData.meta.crit_rate,
          ailment_chance: moveData.meta.ailment_chance
        }
      }))

      const movesToAssign = await db.moves.insert(newMoves)
      movesToAssign.forEach(async element => {
        await db.assign_move({ pokemon_id, moves_id: element.moves_id })
      })

      const gameCheck = []

      for (let i = 0; i < data.game_indices.length; i++) {
        const j = await client.sismember('game', data.game_indices[i].version.url)
        if (j === 0) {
          gameCheck.push(data.game_indices[i])
        }
      }

      const newGames = await Promise.all(gameCheck.map(async element => {
        const { url: game } = element.version
        const { data: gameData } = await axios.get(game)
        await client.sadd('game', game)
        return {
          name: gameData.name,
          group: gameData.version_group.name,
          id: gameData.id,
          url: game
        }
      }))

      const gamesToAssign = await db.game_index.insert(newGames)
      gamesToAssign.forEach(async element => {
        await db.assign_game({ pokemon_id, game_index_id: element.game_index_id })
      })
    }

    res.status(200).send('yep')
  },

  massiveTest: async (req, res) => {
    const db = req.app.get('db')

    db.stat.insert([{ name: 'andrew' }, { name: 'bob' }, { name: 'ranch' }])

    res.sendStatus(200)
  }
}