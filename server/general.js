const router = require('express').Router();
const { bot } = require('../main')

router.get('/bot', (ref, res) => {
    res.send({
        username: bot.user.username,
        discriminator: bot.user.discriminator,
        id: bot.user.id,
        uptime: bot.uptime,
        createdAt: bot.user.createdTimestamp,
        avatar: bot.user.avatar
    })
})

module.exports = router