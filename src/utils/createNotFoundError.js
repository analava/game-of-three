const ApiError = require('./APIError');
const httpStatus = require('http-status');

module.exports = whatNotFound => new ApiError({ message: `could not find ${whatNotFound}`, status: httpStatus.NOT_FOUND });
