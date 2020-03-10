const mongoose = require('mongoose');
const logger = require('./../config/logger');
const { mongo, env } = require('./vars');



// Exit application on error
mongoose.connection.on('error', (err) => {
    logger.error(`MongoDB connection error: ${err}`);
    mongoose.connect(mongo.uri, {
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000
    });
    //process.exit(-1);
});

// print mongoose logs in dev env
if (env === 'development') {
    mongoose.set('debug', true);
}

/**
 * Connect to mongo db
 *
 * @returns {object} Mongoose connection
 * @public
 */
exports.connect = (app) => {
    mongoose.connect(mongo.uri, {
        //keepAlive: 1,
        useNewUrlParser: true,
        useCreateIndex: true,
        reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
        reconnectInterval: 1000,
    });
    mongoose.connection.once('open', function() {
        // All OK - fire (emit) a ready event. 
        app.emit('ready');
    });
    return mongoose.connection;
};