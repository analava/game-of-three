const express = require('express');
const validate = require('express-validation');
const gameController = require('./game.controller');


const router = express.Router();

router.route('/')
    .post(async(req, res) => {
        const game = await gameController.startGame(req.body.kind, req.body.playerName, req.body.initial_number, req.body.nextPlayer, req.body.goal);
        res.json({ data: game });
    });


module.exports = router;