const axios = require('axios')
const client = require('../redisAsync')

module.exports = {
  getAllPokemon: async (req, res) => {
    const {start, end} = req.query
    if(+end - +start > 100){
      return res.status(403).send('invalid range')
    }
    const exists = await client.exists('pokemon')
    const count = await client.get('count')
    let url = 'https://pokeapi.co/api/v2/pokemon'

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
      updateList()
    } else {
      const countUpdate = await axios.get(url)
      if(countUpdate.data.count !== +count){
        client.del('pokemon')
        updateList()
      }
    }

    res.status(200).send(pokemon)
  }
}