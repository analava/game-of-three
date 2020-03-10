const Game = require('./game.model');
const playerController = require('../player/player.controller');
const { random, choiceRange } = require('../../utils/random');

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



exports.handleTurnAndDoTheMove = async(game_id, player_id, moveNumber) => {

    const game = await Game.aggregate([{
            $match: { _id: mongoose.Types.ObjectId(game_id) }
        },
        {
            $lookup: {
                from: 'players',
                localField: 'nextPlayer',
                foreignField: '_id',
                as: 'nextPlayer'
            }
        },
        { $unwind: { path: '$nextPlayer' } }
    ]);

    if (game[0].nextPlayer._id.toString() != player_id.toString()) {
        throw new Error('Invalid turn');
    } else {
        if (!moveNumber && moveNumber != 0) {
            choiceRange(game[0].goal).map((item) => {
                if ((game[0].currentNumber + item) % game[0].goal == 0) {
                    moveNumber = item;
                }
            });
        }
        const movedGame = await this.move(game_id, player_id, moveNumber);

        // check if nextPlayer is human or machine. if it is machine, call this function with the new player
        const nextPlayer = await playerController.findById(movedGame.nextPlayer);
        if (nextPlayer.kind == 'MACHINE') {
            await this.handleTurnAndDoTheMove(game_id, movedGame.nextPlayer);
        }
        return;
    }
}

exports.move = async(game_id, player_id, moveNumber) => {
    const game = await Game.findById(game_id);

    if (!game) {
        throw new Error('Invalid Game'); // fix status
    }

    if (player_id.toString() != game.nextPlayer) {
        throw new Error('It is not your turn!'); // fix status
    }

    const validChoiceRange = choiceRange(game.goal);
    if (validChoiceRange.indexOf(moveNumber) == -1) {
        throw new Error('Invalid choice number'); // fix status
    }

    let newNumber = game.currentNumber + moveNumber;
    if (newNumber % game.goal != 0) {
        throw new Error('Not correctly divisable by goal'); // fix status
    } else {
        const currentNumber = newNumber / game.goal;
        game.currentNumber = currentNumber;
        game.nextPlayer = game.players[(game.players.indexOf(player_id) + 1) % game.players.length];
        await game.save();
        return game;
    }
}

async function createPlayersBasedOnGameKind(gameKind, playerName, nextPlayer) {
    let addPlayers;
    switch (gameKind) {
        case 'SINGLE-PLAYER':
            {
                addPlayers = [
                    playerController.createPlayer({ name: playerName, kind: 'HUMAN' }),
                    playerController.createPlayer({ kind: 'MACHINE' })
                ];
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