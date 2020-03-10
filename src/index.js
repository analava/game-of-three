const { port, env } = require('./config/vars');
const logger = require('./config/logger');


// add Joi Object-id validator to Joi
require('./config/joi');

// *** SO IMPORTANT *** this will handle promises on routers 
require('express-async-errors');

process.on('unhandledRejection', (ex) => {
    throw ex;
});

const app = require('./config/express');

const mongoose = require('./config/mongoose');

// open mongoose connection
mongoose.connect(app);

// listen to requests
app.on('ready', function () {
    app.listen(port, () => logger.info(`server started on port ${port} (${env})`));
});
/**
* Exports express
* @public
*/
module.exports = app;
