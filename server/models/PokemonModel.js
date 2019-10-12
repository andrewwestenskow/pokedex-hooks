const mongoose = require('mongoose')
      Abilities = require('./abilitiesModel')
      Forms = require('./formsModel')
      GameIndices = require('./gameIndiciesModel')
      HeldItems = require('./heldItemsModel')
      Moves = require('./movesModel')
      Species = require('./speciesModel')
      Stats = require('./statsModel')
      Types = require('./typesModel')


const PokemonSchema = new mongoose.Schema({
  number: { type: 'number', required: true, unique: true },
  name: { type: 'string', required: true },
  order: { type: 'number', required: true },
  height: { type: 'number', required: true },
  weight: { type: 'number', required: true },
  abilities: [Abilities],
  forms: [Forms],
  game_indices: [GameIndices],
  held_items: [HeldItems],
  moves: [Moves],
  species: [Species],
  sprites: { type: 'array' },
  stats: [Stats],
  types: [Types]
})

module.exports = mongoose.model("Pokemon", PokemonSchema)