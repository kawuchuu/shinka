const { raw } = require('youtube-dl-exec');
//const { bot } = require('../../main')
const { getVoiceConnection, createAudioPlayer, createAudioResource, demuxProbe } = require('@discordjs/voice')
let serverQueue = {np: null};

const play = (msg) => {
    const server = serverQueue[msg.guild.id]
    const connection = getVoiceConnection(msg.guild.id)
    const player = createAudioPlayer()
    player.on('error', err => {
        console.error(err)
    })
    const streamProcess = raw(server.queue[0].url, {
        o: '-',
        q: '',
        f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
        r: '100K'
    })
    const stream = streamProcess.stdout
    streamProcess.once('spawn', () => {
        demuxProbe(stream).then(probe => {
            let resource = createAudioResource(probe.stream)
            player.play(resource)
            connection.subscribe(player)
        }).catch(err => {
            if (!streamProcess.killed) process.kill()
            stream.resume()
            console.log(err)
        })
    })
    server.queue.shift()
}

module.exports.serverQueue = serverQueue;
module.exports.play = play;
module.exports.notCommand = true;