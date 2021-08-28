const router = require('express').Router()
const { bot } = require('../main')

router.get('/', async (req, res) => {
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
})

module.exports = router