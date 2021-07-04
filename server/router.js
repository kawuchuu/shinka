const express = require('express');
const router = express.Router();

router.use('/yt', require('./yt'))

module.exports = router