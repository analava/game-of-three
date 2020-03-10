const express = require('express');
const validate = require('express-validation');
const { newGame } = require('./game.validation');
const gameController = require('./game.controller');

const authorization = require('../../utils/authorization');

const router = express.Router();

router.route('/')
    .post(validate(newGame), async(req, res) => {
        const game = await gameController.startGame(req.body.kind, req.body.playerName, req.body.initial_number, req.body.nextPlayer, req.body.goal);
        res.json({ data: game });
    });

router.route('/:id')
    .put(authorization(), async(req, res) => {
        const game = await gameController.handleTurnAndDoTheMove(req.params.id, req.user._id, req.body.moveNumber);
        res.json({ data: game });
    })
    .get(async(req, res) => {
        const game = await gameController.getGame(req.params.id);
        res.json({ data: game });
    })

module.exports = router;