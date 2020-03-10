const redis = require("redis");
const { REDIS } = require('./vars');

const client = redis.createClient({
    host: REDIS.host,
    port: REDIS.port
});
module.exports = client;