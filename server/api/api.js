const express = require('express');
const router = express.Router();

let guilds = require('./guilds');
let client = require('./client');

router.use('/guilds', guilds);
router.use('/client', client);

module.exports = router;