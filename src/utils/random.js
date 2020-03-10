const RANDOM_INITIAL_NUMBER_START = require('../config/vars').RANDOM_INITIAL_NUMBER_START;
const RANDOM_INITIAL_NUMBER_END = require('../config/vars').RANDOM_INITIAL_NUMBER_END;

exports.random = (min = RANDOM_INITIAL_NUMBER_START, max = RANDOM_INITIAL_NUMBER_END) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}