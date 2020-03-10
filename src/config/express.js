
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const routes = require('./routes');
const { logs } = require('./vars');
const error = require('./error');


/**
* Express instance
* @public
*/
const app = express();

// request logging. dev: console | production: file
app.use(morgan(logs));

// secure apps by setting various HTTP headers
app.use(helmet());

// routes
app.use(routes);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);


module.exports = app;
