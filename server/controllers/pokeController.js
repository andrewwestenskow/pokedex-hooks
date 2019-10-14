const axios = require('axios')
const client = require('../redisAsync')
const Fuse = require('fuse.js')

module.exports = {
  fetchList: async (req, res) => {
    const list = await client.lrange('pokemon', 0, -1)
    list.forEach((element, index, array) => {
      const info = JSON.parse(element)
      array[index] = { name: info.name }
    })
    res.status(200).send(list)
  },

  getAllPokemon: async (req, res) => {
    const { start, end } = req.query

    // console.log(start, end)
    if (+end - +start > 100 && +start !== +end) {
      return res.status(403).send('invalid range')
    }
    const exists = await client.exists('pokemon')
    const count = await client.get('count')
    let url = 'https://pokeapi.co/api/v2/pokemon'

    if (start === 'NaN') {
      console.log('yep')
      return res.status(416).send({ pokemon: [], range: count })
    }
    const updateList = async () => {
      let keepGoing = true
      while (keepGoing) {
        const result = await axios.get(url)
        client.set('count', result.data.count)
        if (result.data.next) {
          result.data.results.forEach(element => client.rpush('pokemon', JSON.stringify(element)))
          url = result.data.next
        } else {
          keepGoing = false
        }
      }
    }

    if (exists === 0) {
      await updateList()
    } else {
      const countUpdate = await axios.get(url)
      if (countUpdate.data.count !== +count) {
        client.del('pokemon')
        await updateList()
      }
    }


    const data = await client.lrange('pokemon', +start, +end)
    const pokemon = await Promise.all(data.map(async element => {
      const object = JSON.parse(element)
      const pokeExists = await client.exists(object.name)
      if (pokeExists === 1) {
        const listPokemon = await client.get(object.name)
        return JSON.parse(listPokemon)
      } else {
        const details = await axios.get(object.url)
        // console.log(details.data.id)
        const info = {
          img: details.data.sprites.front_default,
          id: details.data.id,
          height: details.data.height,
          weight: details.data.weight,
          type: details.data.types[0].type.name,
          name: object.name
        }
        client.set(object.name, JSON.stringify(info))
        return info
      }
    }))

    const length = await client.llen('pokemon')

    res.status(200).send({ pokemon, max: length })

  }
}