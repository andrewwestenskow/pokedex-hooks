require('dotenv').config()
const express = require('express')
const app = express()
const massive = require('massive')
const session = require('express-session')
const mongoose = require('mongoose')
const { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env
const pokeCtrl = require('./controllers/pokeController')
const indvCtrl = require('./controllers/individualController')

app.use(express.json())
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
}))

app.get('/api/pokemon', pokeCtrl.getAllPokemon)
app.get('/api/pokemon/list', pokeCtrl.fetchList)
app.get('/api/pokemon/:name', indvCtrl.getPokemonByName)
app.get('/massive', indvCtrl.massiveTest)

app.listen(SERVER_PORT, () => console.log(`listening on port ${SERVER_PORT}`))

massive(CONNECTION_STRING).then(db => {
  app.set('db', db)
  console.log('db set')
})

// mongoose.connect(CONNECTION_STRING,
//   { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
//   .then(mdb => {
//     app.set('mongo', mdb)
//     console.log('mongo set')
//   })