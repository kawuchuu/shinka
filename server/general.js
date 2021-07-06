const router = require('express').Router();
const { bot } = require('../main')

router.get('/bot', (ref, res) => {
    res.send({
        username: bot.user.username,
        discriminator: bot.user.discriminator,
        id: bot.user.id,
        uptime: bot.uptime,
        createdAt: bot.user.createdTimestamp,
        avatar: bot.user.avatar,
        isPublic: bot.application.botPublic,
        owner: {
            username: bot.application.owner.username,
            discriminator: bot.application.owner.discriminator,
            avatar: bot.application.owner.avatar,
            id: bot.application.owner.id,
            mfaEnabled: bot.user.mfaEnabled
        }
    })
})

module.exports = router