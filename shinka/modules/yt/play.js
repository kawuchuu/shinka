const ytdl = require('ytdl-core');
const player = require('./player');

module.exports.run = async (bot, msg, args) => {
    bot.joinVoiceChannel(msg.member.voiceState.channelID).then(async connection => {
        let getMsg = await bot.createMessage(msg.channel.id, 'getting video from youtube...');
        try {
            ytdl.getInfo(args[0], (err, info) => {
                if (err) return console.log(err);
                bot.editMessage(msg.channel.id, getMsg.id, `now playing: ${info.title} by ${info.author.name}`);
                if (!player.serverQueue[msg.member.guild.id]) {
                    player.serverQueue[msg.member.guild.id] = {
                        queue: []
                    }
                }
                player.serverQueue[msg.member.guild.id].queue.push(args[0]);
                if (!connection.playing) {
                    player.play(connection, msg, bot);
                }
            })
        } catch(err) {
            console.log(err);
        }
    }).catch(err => {
        console.log('error: ' + err);
    })
}