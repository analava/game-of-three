const mongoose = require('mongoose');
const Player = require('./player.model');

exports.createPlayer = async(player) => {
    const newPlayer = new Player(player);
    return await newPlayer.save();
}

exports.findById = async(id) => {
    return await Player.findById(id);
}

exports.getPlayer = async(identifier) => {
    const query = mongoose.Types.ObjectId.isValid(identifier) ? { $or: [{ _id: identifier }, { name: identifier }] } : { name: identifier };
    return await Player.findOne(query);
}