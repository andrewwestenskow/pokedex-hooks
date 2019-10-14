const axios = require('axios')
const baseUrl = 'https://pokeapi.co/api/v2/'
module.exports = {
  getPokemonByName: async (req, res) => {
    const db = req.app.get('db')
    const {name} = req.params
    const pokemonUrl = `${baseUrl}/pokemon/${name}`
    let [pokemon] = await db.check_pokemon_by_url({url: pokemonUrl})
    console.log(pokemon)
    if(!pokemon){
      const {data} = await axios.get(pokemonUrl)
      const newPokemon = await db.add_pokemon({
        name: data.name,
        sort_order: data.order,
        height: data.height,
        weight: data.weight,
        id: data.id,
        base_experience: data.base_experience,
        url: pokemonUrl,
        species_url: `${baseUrl}/pokemon-species/${data.id}`
      })
      pokemon = newPokemon
    }

    res.status(200).send(pokemon)
  }
}