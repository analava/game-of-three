module.exports = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    mongo: {
        uri: process.env.NODE_ENV === 'test' ?
            process.env.MONGO_URI_TESTS : process.env.MONGO_URI,
    },
    REDIS: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    },
    logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
    DEFAULT_GAME_GOAL: 3
};