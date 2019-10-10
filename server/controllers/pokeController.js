const axios = require('axios')
const client = require('../redisAsync')
const Fuse = require('fuse.js')

module.exports = {
  getAllPokemon: async (req, res) => {
    const { start, end } = req.query

    // console.log(start, end)
    if (+end - +start > 100 && +start !== +end) {
      return res.status(403).send('invalid range')
    }
    const exists = await client.exists('pokemon')
    const count = await client.get('count')
    let url = 'https://pokeapi.co/api/v2/pokemon'
    
    if(start === 'NaN'){
      console.log('yep')
      return res.status(416).send({pokemon: [], range: count})
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
      const exists = await client.hget(object.name, 'info')
      if (exists) {
        return {
          name: object.name,
          url: object.url,
          info: JSON.parse(exists)
        }
      } else {
        const details = await axios.get(object.url)
        const info = {
          sprites: details.data.sprites,
          id: details.data.id,
          height: details.data.height,
          weight: details.data.weight,
          moves: details.data.moves,
          type: details.data.types[0].type.name
        }
        client.hmset(object.name, 'details', JSON.stringify(details.data), 'info', JSON.stringify(info))
        return {
          name: object.name,
          url: object.url,
          info: info
        }
      }
    }))

    const length = await client.llen('pokemon')

    res.status(200).send({ pokemon, max: length })

  },

  getPokemonByName: async (req, res) => {
    const { name } = req.params
    const list = await client.lrange('pokemon', 0, -1)
    list.forEach((element, index, array) => {
      array[index] = JSON.parse(element)
    })
    
    const options = {
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        "name"
      ]
    };
    const fuse = new Fuse(list, options); // "list" is the item array
    const result = fuse.search(name);
    let details = await client.hget(result[0].name, 'details')

    if (details) {
      return res.status(200).send(JSON.parse(details))
    }

    try {
      details = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
      const info = {
        sprites: details.data.sprites,
        id: details.data.id,
        height: details.data.height,
        weight: details.data.weight
      }
      client.hmset(name, 'details', JSON.stringify(details.data), 'info', JSON.stringify(info))
      return res.status(200).send(details.data)
    } catch (error) {
      return res.status(404).send('Pokemon not found')
    }
  },

  fetchList: async (req, res) => {
    const list = await client.lrange('pokemon', 0, -1)
    list.forEach((element, index, array) => {
      const info = JSON.parse(element) 
      array[index] = {name: info.name}
    })
    res.status(200).send(list)
  }
}