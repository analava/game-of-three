const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
module.exports = {
    newPlayer: {
        body: {
            name: Joi.string().required(),
            kind: Joi.valid('MACHINE', 'HUMAN').required()
        }
    }
}