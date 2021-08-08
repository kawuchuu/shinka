let player = require('./player');
const { getVoiceConnection } = require('@discordjs/voice')

module.exports.run = async (bot, msg) => {
    const serverQ = player.serverQueue[msg.guild.id]
    if (!serverQ) return await msg.reply('Not connected to a voice channel in this server... cannot skip.')
    if (player.serverQueue[msg.guild.id].queue.length == 0) {
        await msg.reply('Nothing left to skip. Leaving voice channel...');
        delete player.serverQueue[msg.guild.id]
        const connection = getVoiceConnection(msg.guild.id)
        if (!connection) return;
        connection.destroy()
        connection.disconnect()
    } else {
        await msg.reply(`Skipped a track.`);
        player.serverQueue[msg.guild.id].player.stop()
    }
}

module.exports.help = {
    name: 'skip',
    category: 'YouTube',
    desc: 'Skips to the next video in the queue'
}