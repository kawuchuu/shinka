const express = require('express');
const cors = require('cors');
const app = express();

const player = require('../modules/yt/player');
const ytapi = require('simple-youtube-api');
const yt = new ytapi(require('../config.json').ytkey);

module.exports.startServer = async (bot) => {
    app.use(express.json({limit: '100kb'}));
    app.use(cors());

    app.listen(64342, 'localhost', err => {
        if (err) return console.log('Failed to start express server!');
        console.log('Express server started');
    })

    app.put('/yt-play', async (req, res) => {
        try {
            const channel = await bot.channels.fetch(req.query.channel)
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
            res.sendStatus(500)
        }
    })
}