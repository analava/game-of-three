const RANDOM_INITIAL_NUMBER_START = require('../config/vars').RANDOM_INITIAL_NUMBER_START;
const RANDOM_INITIAL_NUMBER_END = require('../config/vars').RANDOM_INITIAL_NUMBER_END;

exports.random = (min = RANDOM_INITIAL_NUMBER_START, max = RANDOM_INITIAL_NUMBER_END) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.choiceRange = (goal) => {
    let lowerBound = 0 - Math.floor(goal / 2);
    let upperBound = 0 + Math.floor(goal / 2);

    return range(lowerBound, upperBound, 1);
}

const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step));