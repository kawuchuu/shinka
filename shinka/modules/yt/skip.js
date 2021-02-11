let player = require('./player');

module.exports.run = async (bot, msg) => {
    if (player.serverQueue[msg.guild.id].length == 0) {
        msg.channel.send('Nothing left to skip. Leaving voice channel...');
        msg.member.voice.channel.leave();
    } else {
        player.serverQueue[msg.guild.id].dispatcher.end();
        msg.channel.send(`Skipped a track.`);
    }
}

module.exports.help = {
    name: 'skip',
    category: 'YouTube',
    desc: 'Skips to the next video in the queue'
}