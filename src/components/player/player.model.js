const mongoose = require('mongoose');


const playerKind = ['MACHINE', 'HUMAN'];
const playerSchema = new mongoose.Schema({
    kind: {
        type: String,
        enum: playerKind,
        required: true,
        default: 'MACHINE'
    },
    name: {
        type: String
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('player', playerSchema);