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
        isPublic: bot.acApplication.botPublic,
        status: bot.user.presence.status,
        owner: {
            username: bot.acApplication.owner.username,
            discriminator: bot.acApplication.owner.discriminator,
            avatar: bot.acApplication.owner.avatar,
            id: bot.acApplication.owner.id,
            mfaEnabled: true
        }
    }
    if (bot.user.presence.activities[0]) {
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