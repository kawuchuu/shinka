let player = require('./player');

module.exports.run = async (bot, msg) => {
    let nextTrack = player.serverQueue[msg.member.guild.id].queue[0];
    if (!nextTrack) {
        bot.createMessage(msg.channel.id, 'Nothing left to skip. Leaving voice channel...');
    } else {
        bot.createMessage(msg.channel.id, `Skipped a track.\n**Now Playing:** ${nextTrack.title}`)
    }
    player.serverQueue[msg.member.guild.id].dispatcher.stopPlaying();
}