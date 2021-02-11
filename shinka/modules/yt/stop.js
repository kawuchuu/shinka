let player = require('./player');

module.exports.run = async (bot, msg) => {
    msg.channel.send('Leaving voice channel...');
    let server = player.serverQueue[msg.member.guild.id]
    server.queue = [];
    server.np = null;
    server.connection.channel.leave();
}

module.exports.help = {
    name: 'stop',
    category: 'YouTube',
    desc: 'Stops playing a video and leaves the voice channel'
}