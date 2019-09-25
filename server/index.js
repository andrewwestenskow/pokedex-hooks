require('dotenv').config()
const express = require('express')
const app = express()
const massive = require('massive')
const session = require('express-session')
const { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env
const pokeCtrl = require('./controllers/pokeController')

app.use(express.json())
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
}))

app.get('/api/pokemon/all', pokeCtrl.getAllPokemon)


massive(CONNECTION_STRING).then(db => {
  app.set('db', db)
  console.log('db set')
  app.listen(SERVER_PORT, () => console.log(`listening on port ${SERVER_PORT}`))
})