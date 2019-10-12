const axios = require('axios')
const Pokemon = require('../models/pokemonModel')

module.exports = {
  getPokemonByName: async (req, res) => {
    const {name} = req.params
    const pokemon = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)

    const newPokemon = new Pokemon()
    newPokemon.name = pokemon.data.name
    newPokemon.number = pokemon.data.id
    newPokemon.order = pokemon.data.order
    newPokemon.height = pokemon.data.height
    newPokemon.weight = pokemon.data.weight
    newPokemon.abilities = pokemon.data.abilities
    newPokemon.forms = pokemon.data.forms
    newPokemon.game_indices = pokemon.data.game_indices
    newPokemon.held_items = pokemon.data.held_items
    newPokemon.moves = pokemon.data.moves
    newPokemon.species = pokemon.data.species
    newPokemon.sprites = pokemon.data.sprites
    newPokemon.stats = pokemon.data.stats
    newPokemon.types = pokemon.data.types
    newPokemon.save((err, data) => {
      if(err){
        console.log(err)
        res.status(500).send('Something went wrong')
      } else {
        res.status(200).send(data)
      }
    })
  }
}