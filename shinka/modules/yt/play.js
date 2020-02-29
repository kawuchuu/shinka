const player = require('./player');
const ytapi = require('simple-youtube-api');
const yt = new ytapi(require('../../config.json').ytkey);

module.exports.run = async (bot, msg) => {
    bot.joinVoiceChannel(msg.member.voiceState.channelID).catch(err => {
        console.log(err);
    }).then(async connection => {
        let getMsg = await bot.createMessage(msg.channel.id, 'Searching YouTube...');
        try {
            yt.searchVideos(msg.content.substr(8), 2).then(results => {
                if (!player.serverQueue[msg.member.guild.id]) {
                    player.serverQueue[msg.member.guild.id] = {
                        queue: []
                    }
                }
                player.serverQueue[msg.member.guild.id].queue.push({
                    url: results[0].url,
                    title: results[0].title,
                    channel: results[0].channel.title,
                    thumbnail: results[0].thumbnails.medium.url
                });
                if (!connection.playing) {
                    player.play(connection, msg, bot);
                    bot.editMessage(msg.channel.id, getMsg.id, `**Now Playing:** ${results[0].title}`);
                } else {
                    bot.editMessage(msg.channel.id, getMsg.id, `**Added to queue:** ${results[0].title}`);
                }
            })
        } catch(err) {
            console.log(err);
        }
    })
}