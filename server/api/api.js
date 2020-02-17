const express = require('express');
const router = express.Router();

let guilds = require('./guilds');

router.use('/guilds', guilds);

module.exports = router;