const ytdl = require('ytdl-core');
//const { bot } = require('../../main')
const { getVoiceConnection, createAudioPlayer, createAudioResource } = require('@discordjs/voice')
let serverQueue = {np: null};

const play = (msg) => {
    const server = serverQueue[msg.guild.id]
    const connection = getVoiceConnection(msg.guild.id)
    const player = createAudioPlayer()
    let resource = createAudioResource(ytdl(server.queue[0].url))
    player.play(resource)
    connection.subscribe(player)
}

module.exports.serverQueue = serverQueue;
module.exports.play = play;
module.exports.notCommand = true;