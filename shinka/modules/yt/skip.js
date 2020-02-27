let player = require('./player');

module.exports.run = async (bot, msg) => {
    player.serverQueue[msg.member.guild.id].dispatcher.stopPlaying();
    bot.createMessage(msg.channel.id, 'skipped song')
}