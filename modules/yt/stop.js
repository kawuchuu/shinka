const player = require('./player');
const { getVoiceConnection } = require('@discordjs/voice')

module.exports.run = async (bot, msg) => {
    if (player.serverQueue[msg.guild.id] && player.serverQueue[msg.guild.id].np) {
        await msg.reply('Leaving voice channel...');
        const connection = getVoiceConnection(msg.guild.id)
        delete player.serverQueue[msg.guild.id]
        if (!connection) return;
        connection.destroy()
        connection.disconnect()
    } else {
        await msg.reply('There is no voice channel to leave.')
    }
}

module.exports.help = {
    name: 'stop',
    category: 'YouTube',
    desc: 'Stops playing a video and leaves the voice channel'
}