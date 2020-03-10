const express = require('express');
const validate = require('express-validation');
const { newPlayer } = require('./player.validation');
const playerController = require('./player.controller');


const router = express.Router();
router.route('/')
    .post(validate(newPlayer), async(req, res) => {
        const player = await playerController.createPlayer(req.body);
        res.json({ data: player });
    });
module.exports = router;