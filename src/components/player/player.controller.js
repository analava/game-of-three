const mongoose = require('mongoose');
const Player = require('./player.model');

exports.createPlayer = async(player) => {
    const newPlayer = new Player(player);
    return await newPlayer.save();
}