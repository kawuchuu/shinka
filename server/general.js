const router = require('express').Router();
const { io } = require('.');
const { bot } = require('../main')

router.get('/bot', (ref, res) => {
    let botInfo = {
        username: bot.user.username,
        discriminator: bot.user.discriminator,
        id: bot.user.id,
        uptime: bot.uptime,
        createdAt: bot.user.createdTimestamp,
        avatar: bot.user.avatar,
        isPublic: bot.application.botPublic,
        status: bot.user.presence.status,
        owner: {
            username: bot.application.owner.username,
            discriminator: bot.application.owner.discriminator,
            avatar: bot.application.owner.avatar,
            id: bot.application.owner.id,
            mfaEnabled: true
        }
    }
    if (bot.user.presence.activities) {
        botInfo['activity'] = {
            name: bot.user.presence.activities[0].name,
            type: bot.user.presence.activities[0].type
        }
    }
    res.send(botInfo)
})

bot.on('presenceUpdate', (oldP, newP) => {
    if (newP.userID !== bot.user.id) return
    let presence = {
        status: newP.status
    }
    if (newP.activities[0]) {
        presence['activities'] = {
            details: newP.activities[0].details,
            name: newP.activities[0].name,
            state: newP.activities[0].state,
            type: newP.activities[0].type
        }
    }
    io.emit('presenceUpdate', presence)
})

module.exports = router