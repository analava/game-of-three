const express = require('express');
const gameRouter = require('../components/game').router;
const playerRouter = require('../components/player').router;

const welcomeRouter = express.Router();
const router = express.Router();


welcomeRouter.use('/api/v1', router);

router.use(express.json());

router.get('/sup', (req, res) => res.send('Nothing'));
router.use('/player', playerRouter)
router.use('/game', gameRouter);



module.exports = welcomeRouter;