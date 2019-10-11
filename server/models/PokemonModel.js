const mongoose = require('mongoose')

const PokemonSchema = new mongoose.Schema({
	number: {type: 'number', required: true, unique: true},
  name: {type: 'string', required: true},
  order: {type: 'number', required: true},
  height: {type: 'number', required: true},
  weight: {type: 'number', required: true},
  abilities: {type: 'array'},
  forms: {type: 'array'},
  game_indices: {type: 'array'},
  held_items: {type: 'array'},
  moves: {type: 'array'},
  species: {type: 'array'},
  sprites: {type: 'array'},
  stats: {type: 'array'},
  types: {type: 'array'}
})

module.exports = mongoose.model("Pokemon", PokemonSchema)