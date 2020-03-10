const Game = require('./game.model');
const playerController = require('../player/player.controller');
const { random } = require('../../utils/random');

exports.startGame = async(gameKind, playerName, initial_number, nextPlayer, goal) => {
    const players = [];
    let addedPlayers = await createPlayersBasedOnGameKind(gameKind, playerName, nextPlayer);
    addedPlayers.map((item) => {
        players.push(item._id);
    });
    let game = new Game({
        kind: gameKind,
        players: players,
        nextPlayer: players[1],
        currentNumber: initial_number ? initial_number : random(),
        ...(goal && { goal: goal }),
    });
    return await game.save();
};


async function createPlayersBasedOnGameKind(gameKind, playerName, nextPlayer) {
    let addPlayers;
    switch (gameKind) {
        case 'SINGLE-PLAYER':
            {

            }
            break;
        case 'MULTI-PLAYER':
            {

            }
            break;
        case 'AUTOMATIC':
            {
                addPlayers = [
                    playerController.createPlayer({ kind: 'MACHINE' }),
                    playerController.createPlayer({ kind: 'MACHINE' })
                ];
            }
            break;
    }
    const addedPlayers = await Promise.all(addPlayers);

    return addedPlayers;
}