const mongoose = require('mongoose');
const Game = require('./game.model');
const playerController = require('../player/player.controller');
const { random, choiceRange } = require('../../utils/random');
const redisClient = require('../../config/redis');

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
        await game.save();

        await redisClient.set(game._id.toString(), JSON.stringify([{ log: `Game started by ${addedPlayers[0].name ? addedPlayers[0].name: `NO_NAME_${addedPlayers[0]._id}`} with number ${game.currentNumber}`,data:{currentNumber: game.currentNumber}}]));
        
        const gameInfo = {
            game: game._id,
            player: players[0],
            nextPlayer: players[1]};
        
        if (addedPlayers[1].kind == 'MACHINE') {
        const {moves, logs} = await this.handleTurnAndDoTheMove(game._id, game.nextPlayer);
        return Object.assign(gameInfo,{
            logs,
            moves
        });
    }
    else{
       const {moves, logs} = await this.getGame(game._id);
       return Object.assign(gameInfo,{logs,moves})
    }
    
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
        const message = `"${game[0].nextPlayer.name ? game[0].nextPlayer.name :`NO_NAME_${player_id}`}" moved. moved by: ${moveNumber}, resulting number: ${movedGame.currentNumber}`;
        await redisClient.put(game_id, {log: message, data:{ currentNumber:game[0].currentNumber, moveNumber: moveNumber, addedNumber: game[0].currentNumber + moveNumber, resultingNumber:  movedGame.currentNumber}} );
        if (movedGame.currentNumber == 1) {
            const message = `"${game[0].nextPlayer.name ? game[0].nextPlayer.name :`NO_NAME_${player_id}`}" is The winner`;
            await redisClient.put(game_id,{log:message} );
            return formatResponse(JSON.parse(await redisClient.redisGet(game_id.toString())));
        }
        // check if nextPlayer is human or machine. if it is machine, call this function with the new player
        const nextPlayer = await playerController.findById(movedGame.nextPlayer);
        if (nextPlayer.kind == 'MACHINE') {
            await this.handleTurnAndDoTheMove(game_id, movedGame.nextPlayer);
        }
        return formatResponse(JSON.parse(await redisClient.redisGet(game_id.toString())));
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

async function formatResponse(response){
    const logs = [];
    const moves = [];
    response.map((item)=>{
        if (item.log) logs.push(item.log);
        if (item.data) moves.push(item.data);
    })
    return {logs, moves}
}