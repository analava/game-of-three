const redis = require("redis");
const { REDIS } = require('./vars');
const { promisify } = require("util");
const client = redis.createClient({
    host: REDIS.host,
    port: REDIS.port
});
client.redisGet = promisify(client.get).bind(client);
client.put = async(key, value) => {
    let history = JSON.parse(await client.redisGet(key.toString()));
    history.push(value);
    await client.set(key.toString(), JSON.stringify(history));
    return history;
}
module.exports = client;