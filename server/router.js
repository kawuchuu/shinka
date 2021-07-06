const express = require('express');
const router = express.Router();

router.use('/yt', require('./yt'))

router.use('/', require('./general'))

module.exports = router