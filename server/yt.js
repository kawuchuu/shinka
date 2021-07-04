const player = require('../modules/yt/player');
const ytapi = require('simple-youtube-api');
const yt = new ytapi(require('../config.json').ytkey);

const router = require('express').Router();
const { bot } = require('../main')

router.use(async (req, res, next) => {
    try {
        req.channel = await bot.channels.fetch(req.query.channel)
        next()
    } catch(err) {
        console.error(err)
        res.sendStatus(400)
    }
})

router.put('/play', async (req, res) => {
    if (req.query.q.length === 0) return res.sendStatus(400)
    try {
        const channel = req.channel
        if (channel.type != 'voice') return res.sendStatus(400)
        const connection = await channel.join()
        try {
            yt.searchVideos(req.query.q, 2).then(results => {
                if (!player.serverQueue[channel.guild.id]) {
                    player.serverQueue[channel.guild.id] = {
                        queue: []
                    }
                }
                //so we can get the duration...
                yt.getVideoByID(results[0].id).then(video => {
                    player.serverQueue[channel.guild.id].queue.push({
                        url: video.url,
                        title: video.title,
                        channel: video.channel.title,
                        channelUrl: video.channel.url,
                        thumbnail: video.thumbnails.high.url,
                        duration: parseInt(video.durationSeconds),
                        durationDisplay: `${video.duration.minutes}:${video.duration.seconds}`
                    });
                    if (!player.serverQueue[channel.guild.id].np) {
                        player.play(connection, null, bot, channel);
                    }
                    console.log(video.durationSeconds);
                })
            })
        } catch(err) {
            console.log(err)
            res.sendStatus(500)
        }
        res.sendStatus(200)
    } catch(err) {
        res.sendStatus(400)
    }
})

router.put('/pause', (req, res) => {
    try {
        const server = player.serverQueue[req.channel.guild.id]
        if (!server) return res.sendStatus(400)
        server.dispatcher.pause()
        res.sendStatus(200)
    } catch(err) {
        res.sendStatus(500)
    }
})

router.put('/resume', (req, res) => {
    try {
        const server = player.serverQueue[req.channel.guild.id]
        if (!server) return res.sendStatus(400)
        server.dispatcher.resume()
        res.sendStatus(200)
    } catch(err) {
        res.sendStatus(500)
    }
})

module.exports = router