const axios = require('axios')
const baseUrl = 'https://pokeapi.co/api/v2/'
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

      const newAbilities = await Promise.all(data.abilities.map(async element => {
        const { url: ability } = element.ability
        const { data: abilityData } = await axios.get(ability)
        // const [{ability_id}] = db.add_ability({
        //   id: abilityData.id,
        //   name: abilityData.name,
        //   effect: abilityData.effect_entries[0].effect,
        //   short_effect: abilityData.effect_entries[0].short_effect,
        //   url: ability
        // })
        return {
          id: abilityData.id,
          name: abilityData.name,
          effect: abilityData.effect_entries[0].effect,
          short_effect: abilityData.effect_entries[0].short_effect,
          url: ability
        }
        // await db.assign_ability({ pokemon_id, ability_id })
      }))

      const thing = await db.ability.insert(newAbilities)
    }

    res.status(200).send('yep')
  },

  massiveTest: async (req, res) => {
    const db = req.app.get('db')

    db.stat.insert([{ name: 'andrew' }, { name: 'bob' }, { name: 'ranch' }])

    res.sendStatus(200)
  }
}