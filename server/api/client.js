const express = require('express');
const router = express.Router();
const bot = require('bot');

router.use('/', (req, res, next) => {
    if (!bot.user) {
        res.status(404).send();
    }
    req.botuser = {
        username: bot.user.username,
        discriminator: bot.user.discriminator,
        id: bot.user.id,
        avatarURL: bot.user.dynamicAvatarURL()
    }
    next();
});

router.get('/', (req, res) => {
    res.status(200).send(req.botuser);
})

router.post('/updateAvatar', (req, res) => {
    console.log(req.body);
});

module.exports = router;