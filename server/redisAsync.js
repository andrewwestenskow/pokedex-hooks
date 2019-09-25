const redis = require('redis')
const client = redis.createClient()
const {promisify} = require('util')
client.on("error", (err) => console.log(`Error: ${err}`))

module.exports = {
  get: promisify(client.get).bind(client),
  exists: promisify(client.exists).bind(client),
  lrange: promisify(client.lrange).bind(client),
  set: promisify(client.set).bind(client),
  rpush: promisify(client.rpush).bind(client),
  del: promisify(client.del).bind(client)
}