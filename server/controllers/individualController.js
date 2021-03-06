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
      //INSERT BASIC POKEMON DATA
      const [{ pokemon_id }] = await db.add_pokemon({
        name: data.name,
        sort_order: data.order,
        height: data.height,
        weight: data.weight,
        id: data.id,
        base_experience: data.base_experience,
        url: pokemonUrl,
        species_url: `${baseUrl}/pokemon-species/${data.id}`,
      })

      await client.sadd('pokemon-set', pokemonUrl)

      //INSERT SPRITES

      const {
        front_default,
        front_shiny,
        front_female,
        front_shiny_female,
        back_default,
        back_shiny,
        back_female,
        back_shiny_female,
      } = data.sprites

      await db.add_sprites({
        pokemon_id,
        front_default,
        front_shiny,
        front_female,
        front_shiny_female,
        back_default,
        back_shiny,
        back_female,
        back_shiny_female,
      })

      //INSERT STATS

      const statInsert = {}
      data.stats.forEach(element => {
        let colName = element.stat.name
        if (colName.includes('-')) {
          colName = colName.replace(/-/g, '_')
        }
        statInsert[colName] = element.base_stat
      })
      const {
        hp,
        attack,
        defense,
        special_attack,
        special_defense,
        speed,
        accuracy,
        evasion,
      } = statInsert

      await db.add_stats({
        pokemon_id,
        hp,
        attack,
        defense,
        special_attack,
        special_defense,
        speed,
        accuracy,
        evasion,
      })

      //FETCH EVOLUTIONS
      const { data: speciesData } = await axios.get(
        `${baseUrl}/pokemon-species/${name}`,
      )
      const {
        data: { chain: evolutionChain },
      } = await axios.get(speciesData.evolution_chain.url)
      let evolutions = []
      const extractEvolution = async (evolution, name) => {
        if (evolution.species.name === name) {
          evolutions = [...evolution.evolves_to]
          evolutions.forEach(element => {
            delete element.evolves_to
          })
          evolutions = await Promise.all(
            evolutions.map(async element => {
              if (element.evolution_details[0].item) {
                const itemCheck = await client.sismember(
                  'item',
                  element.evolution_details[0].item.url,
                )
                let item_id
                if (itemCheck === 0) {
                  client.sadd('item', element.evolution_details[0].item.url)
                  const { data: itemDetails } = await axios.get(
                    element.evolution_details[0].item.url,
                  )
                  const itemObj = {
                    id: itemDetails.id,
                    name: itemDetails.name,
                    cost: itemDetails.cost,
                    sprite: itemDetails.sprites.default,
                    url: element.evolution_details[0].item.url,
                  }
                  const newItem = await db.item.insert([itemObj])
                  item_id = newItem[0].item_id
                } else {
                  const oldItem = await db.get_item_by_url(
                    'element.evolution_details[0].item.url',
                  )
                  item_id = oldItem[0].item_id
                }

                if (speciesData.evolves_from_species) {
                  return {
                    pokemon_id: pokemon_id,
                    evolves_from: speciesData.evolves_from_species.url,
                    evolves_to: element.species.name,
                    item: item_id,
                  }
                } else {
                  return {
                    pokemon_id: pokemon_id,
                    evolves_from: null,
                    evolves_to: element.species.name,
                    item: item_id,
                  }
                }
              } else {
                return {
                  pokemon_id: pokemon_id,
                  evolves_from: null,
                  evolves_to: element.species.name,
                  item: null,
                }
              }
            }),
          )
          return
        } else {
          const toCheck = [...evolution.evolves_to]
          toCheck.forEach(async element => {
            if (element.species.name === name) {
              evolutions = [...element.evolves_to]
              evolutions.forEach(element => {
                delete element.evolves_to
              })
              evolutions = await Promise.all(
                evolutions.map(async element => {
                  if (element.evolution_details[0].item) {
                    const itemCheck = await client.sismember(
                      'item',
                      element.evolution_details[0].item.url,
                    )
                    let item_id
                    if (itemCheck === 0) {
                      client.sadd('item', element.evolution_details[0].item.url)
                      const { data: itemDetails } = await axios.get(
                        element.evolution_details[0].item.url,
                      )
                      const itemObj = {
                        id: itemDetails.id,
                        name: itemDetails.name,
                        cost: itemDetails.cost,
                        sprite: itemDetails.sprites.default,
                        url: element.evolution_details[0].item.url,
                      }
                      const newItem = await db.item.insert([itemObj])
                      item_id = newItem[0].item_id
                    } else {
                      const oldItem = await db.get_item_by_url(
                        'element.evolution_details[0].item.url',
                      )
                      item_id = oldItem[0].item_id
                    }

                    return {
                      pokemon_id: pokemon_id,
                      evolves_from: speciesData.evolves_from_species.url,
                      evolves_to: element.species.name,
                      item: item_id,
                    }
                  } else {
                    return {
                      pokemon_id: pokemon_id,
                      evolves_from: speciesData.evolves_from_species.url,
                      evolves_to: element.species.name,
                      item: null,
                    }
                  }
                }),
              )
            } else {
              element.evolves_to.forEach(element => {
                extractEvolution(element, element.species.name)
              })
            }
          })
        }
      }
      await extractEvolution(evolutionChain, name)

      if (evolutions.length === 0) {
        const { data: finalEvolution } = await axios.get(
          `${baseUrl}/pokemon-species/${name}`,
        )
        evolutions = [
          {
            pokemon_id: pokemon_id,
            evolves_from: finalEvolution.evolves_from_species.url,
            evolves_to: null,
            item: null,
          },
        ]
      }

      db.evolution.insert(evolutions)

      //FETCH AND INSERT ABILITIES

      const abilityCheck = []
      const abilitiesToAssign = []

      for (let i = 0; i < data.abilities.length; i++) {
        const j = await client.sismember(
          'ability',
          data.abilities[i].ability.url,
        )
        if (j === 0) {
          abilityCheck.push(data.abilities[i])
        } else {
          const [{ ability_id }] = await db.find_ability_by_url(
            data.abilities[i].ability.url,
          )
          abilitiesToAssign.push(ability_id)
        }
      }

      const newAbilities = await Promise.all(
        abilityCheck.map(async element => {
          const { url: ability } = element.ability
          const { data: abilityData } = await axios.get(ability)
          await client.sadd('ability', ability)
          return {
            id: abilityData.id,
            name: abilityData.name,
            effect: abilityData.effect_entries[0].effect,
            short_effect: abilityData.effect_entries[0].short_effect,
            url: ability,
          }
        }),
      )

      const newerAbilities = await db.ability.insert(newAbilities)
      newerAbilities.forEach(element => {
        abilitiesToAssign.push(element.ability_id)
      })
      const assignAbilities = abilitiesToAssign.map(element => {
        return { pokemon_id, ability_id: element }
      })
      await db.pokemon_ability.insert(assignAbilities)

      //FETCH AND INSERT MOVES

      const movesCheck = []
      const movesToAssign = []

      for (let i = 0; i < data.moves.length; i++) {
        const j = await client.sismember('moves', data.moves[i].move.url)
        if (j === 0) {
          movesCheck.push(data.moves[i])
        } else {
          const [{ moves_id }] = await db.find_moves_by_url(
            data.moves[i].move.url,
          )
          movesToAssign.push(moves_id)
        }
      }

      const newMoves = await Promise.all(
        movesCheck.map(async element => {
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
            ailment_chance: moveData.meta.ailment_chance,
          }
        }),
      )

      const newerMoves = await db.moves.insert(newMoves)
      newerMoves.forEach(element => {
        movesToAssign.push(element.moves_id)
      })
      const assignMoves = movesToAssign.map(element => {
        return { pokemon_id, moves_id: element }
      })
      await db.pokemon_moves.insert(assignMoves)

      //FETCH AND INSERT GAMES

      const gameCheck = []
      const gamesToAssign = []

      for (let i = 0; i < data.game_indices.length; i++) {
        const j = await client.sismember(
          'game',
          data.game_indices[i].version.url,
        )
        if (j === 0) {
          gameCheck.push(data.game_indices[i])
        } else {
          const [{ game_index_id }] = await db.find_game_index_by_url(
            data.game_indices[i].version.url,
          )
          gamesToAssign.push(game_index_id)
        }
      }

      const newGames = await Promise.all(
        gameCheck.map(async element => {
          const { url: game } = element.version
          const { data: gameData } = await axios.get(game)
          await client.sadd('game', game)
          return {
            name: gameData.name,
            group: gameData.version_group.name,
            id: gameData.id,
            url: game,
          }
        }),
      )

      const newerGames = await db.game_index.insert(newGames)
      newerGames.forEach(element => {
        gamesToAssign.push(element.game_index_id)
      })
      const assignGames = gamesToAssign.map(element => {
        return { pokemon_id, game_index_id: element }
      })
      await db.pokemon_game.insert(assignGames)
    }

    res.status(200).send('yep')
  },

  massiveTest: async (req, res) => {
    const { name } = req.params

    const { data: speciesData } = await axios.get(
      `${baseUrl}/pokemon-species/${name}`,
    )
    const {
      data: { chain: evolutionChain },
    } = await axios.get(speciesData.evolution_chain.url)
    let evolutions = []
    const extractEvolution = (evolution, name) => {
      if (evolution.species.name === name) {
        evolutions = [...evolution.evolves_to]
        evolutions.forEach(element => {
          delete element.evolves_to
        })
        evolutions = evolutions.map(element => {
          if (element.evolution_details[0].item) {
            return {
              pokemon_id: 1,
              evolves_from: null,
              evolves_to: element.species.name,
              item: element.evolution_details[0].item.name,
            }
          } else {
            return {
              pokemon_id: 1,
              evolves_from: null,
              evolves_to: element.species.name,
              item: null,
            }
          }
        })
        return
      } else {
        const toCheck = [...evolution.evolves_to]
        toCheck.forEach(element => {
          if (element.species.name === name) {
            evolutions = [...element.evolves_to]
            evolutions.forEach(element => {
              delete element.evolves_to
            })
            evolutions = evolutions.map(element => {
              if (element.evolution_details[0].item) {
                return {
                  pokemon_id: 1,
                  evolves_from: speciesData.evolves_from_species.url,
                  evolves_to: element.species.name,
                  item: element.evolution_details[0].item.name,
                }
              } else {
                return {
                  pokemon_id: 1,
                  evolves_from: speciesData.evolves_from_species.url,
                  evolves_to: element.species.name,
                  item: null,
                }
              }
            })
          } else {
            element.evolves_to.forEach(element => {
              extractEvolution(element, element.species.name)
            })
          }
        })
      }
    }
    extractEvolution(evolutionChain, name)

    if (evolutions.length === 0) {
      const { data: finalEvolution } = await axios.get(
        `${baseUrl}/pokemon-species/${name}`,
      )
      evolutions = [
        {
          pokemon_id: 1,
          evolves_from: finalEvolution.evolves_from_species.url,
          evolves_to: null,
          item: null,
        },
      ]
    }

    res.status(200).send(evolutions)
  },
}
