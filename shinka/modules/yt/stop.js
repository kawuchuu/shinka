let player = require('./player');

module.exports.run = async (bot, msg) => {
    bot.createMessage(msg.member.guild.id, 'Leaving voice channel...');
    player.serverQueue[msg.member.guild.id].queue = [];
    bot.leaveVoiceChannel(player.serverQueue[msg.member.guild.id].dispatcher.channelID);
}