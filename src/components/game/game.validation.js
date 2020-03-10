const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
module.exports = {
    newGame: {
        body: {
            name: Joi.string(),
            kind: Joi.valid('AUTOMATIC', 'MULTI-PLAYER', 'SINGLE-PLAYER').required(),
            initial_number: Joi.number().min(1).max(100), // fix ==> use env
            goal: Joi.number(),
            nextPlayer: Joi.string().when('kind', { is: 'MULTI-PLAYER', then: Joi.required() })
        }
    }
}