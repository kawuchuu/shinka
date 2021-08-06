const express = require('express');
const router = express.Router();

router.use('/yt', require('./yt'))
router.use('/slashreg', require('./slashreg'))

router.use('/', require('./general'))

module.exports = router