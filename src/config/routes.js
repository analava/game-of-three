const express = require('express');

const welcomeRouter = express.Router();
const router = express.Router();


welcomeRouter.use('/api/v1', router);

router.use(express.json());

router.get('/sup', (req, res) => res.send('Nothing'));



module.exports = welcomeRouter;