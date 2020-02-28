let player = require('./player');

module.exports.run = async (bot, msg) => {
    player.serverQueue[msg.member.guild.id].queue = [];
    bot.leaveVoiceChannel(player.serverQueue[msg.member.guild.id].dispatcher.channelID);
}