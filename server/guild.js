const router = require('express').Router()
const { bot } = require('../main')

router.get('/', async (req, res) => {
    if (req.query.id) {
        const guild = bot.guilds.cache.get(req.query.id)
        res.send({
            name: guild.name,
            id: guild.id,
            icon: guild.icon,
            memberCount: guild.memberCount,
            joinedTimestamp: guild.joinedTimestamp
        })
    } else {
        const guilds = await bot.guilds.fetch()
        const guildsToSend = {}
        guilds.forEach(f => {
            guildsToSend[f.id] = {
                name: f.name,
                icon: f.icon,
                id: f.id,
            }
        })
        res.send(guildsToSend)
    }
})

router.get('/:id', (req, res) => {
    try {
        const guild = bot.guilds.cache.get(req.params.id)
        res.send({
            name: guild.name,
            id: guild.id,
            icon: guild.icon,
            memberCount: guild.memberCount,
            joinedTimestamp: guild.joinedTimestamp
        })
    } catch(err) {
        res.sendStatus(500)
    }
})

// TODO: save this to cache...
router.get('/:id/members', async (req, res) => {
    const members = await bot.guilds.cache.get(req.params.id).members.fetch()
    const membersToSend = {}
    members.forEach(member => {
        membersToSend[member.user.id] = {
            name: member.user.username,
            discrim: member.user.discriminator,
            id: member.user.id,
            avatar: member.user.avatar,
            nick: member.nickname
        }
    })
    res.send(membersToSend)
})

module.exports = router