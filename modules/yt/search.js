const ytapi = require('simple-youtube-api');
const yt = new ytapi(require('../../config.json').ytkey);
const player = require('./player')

module.exports.run = async (bot, msg) => {
    let getMsg = await msg.channel.send('Searching YouTube...');
    try {
        yt.searchVideos(msg.content.substr(10), 5).then(results => {
            let fields = []
            results.forEach((video, index) => {
                fields.push({
                    name: `${index + 1}. ${video.title}`,
                    value: `Channel: ${video.channel.title}\n[Watch Video](${video.url})`
                })
            })
            getMsg.edit(`<@${msg.member.user.id}> Please select a video from the list below. (type a number)`, {
                embed: {
                    title: ':mag_right: Search Results',
                    color: 0xff0000,
                    fields,
                    footer: {
                        text: `Search query: ${msg.content.substr(10)}`
                    }
                }
            })
            let holdInfo = []
            results.forEach(video => {
                holdInfo.push(video.id)
            })
            if (!bot.msgAfter[msg.channel.id]) bot.msgAfter[msg.channel.id] = {}
            bot.msgAfter[msg.channel.id][msg.member.user.username] = {
                cmd: 'search',
                func: 'msgAfter',
                data: holdInfo
            }
        })
    } catch(err) {
        console.error(err)
    }
}

module.exports.msgAfter = async (bot, msg) => {
    const videoID = bot.msgAfter[msg.channel.id][msg.member.user.username].data[parseInt(msg.content) - 1]
    delete bot.msgAfter[msg.channel.id][msg.member.user.username]
    msg.member.voice.channel.join().catch(err => {
        console.error(err)
    }).then(async connection => {
        if (!player.serverQueue[msg.member.guild.id]) {
            player.serverQueue[msg.member.guild.id] = {
                queue: []
            }
        }
        yt.getVideoByID(videoID).then(video => {
            player.serverQueue[msg.member.guild.id].queue.push({
                url: video.url,
                title: video.title,
                channel: video.channel.title,
                channelUrl: video.channel.url,
                thumbnail: video.thumbnails.high.url,
                duration: parseInt(video.durationSeconds),
                durationDisplay: `${video.duration.minutes}:${video.duration.seconds}`
            });
            if (!player.serverQueue[msg.member.guild.id].np) {
                player.play(connection, msg);
                msg.channel.send(`**Now Playing:** ${video.title}`);
            } else {
                msg.channel.send(`**Added to queue:** ${video.title}`);
            }
            console.log(video.durationSeconds);
        })
    })
}

module.exports.help = {
    name: 'search',
    category: 'YouTube',
    args: '<search query>',
    desc: 'Search YouTube for a video'
}