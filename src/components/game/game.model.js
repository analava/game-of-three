const mongoose = require('mongoose');
const DEFAULT_GAME_GOAL = require('../../config/vars').DEFAULT_GAME_GOAL;


const gameKind = ['SINGLE-PLAYER', 'MULTI-PLAYER', 'AUTOMATIC'];
const gameSchema = new mongoose.Schema({
    kind: {
        type: String,
        enum: gameKind
    },
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'players'
    }],
    goal: {
        type: Number,
        default: DEFAULT_GAME_GOAL
    },
    nextPlayer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'players'
    },
    currentNumber: {
        type: Number
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('game', gameSchema);