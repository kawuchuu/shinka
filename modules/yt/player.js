/* 
    Please excuse shit code. This will be rewritten eventually.
*/

const { raw } = require('youtube-dl-exec');
//const { bot } = require('../../main')
const { getVoiceConnection, createAudioPlayer, createAudioResource, demuxProbe, AudioPlayerStatus } = require('@discordjs/voice')
let serverQueue = {np: null};

const play = (msg) => {
    const server = serverQueue[msg.guild.id]
    server.np = server.queue[0]
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
            player.on('stateChange', (oldState, newState) => {
                if (newState.status == AudioPlayerStatus.Idle && oldState.status != AudioPlayerStatus.Idle) {
                    if (server.queue.length == 0) {
                        console.log('doing your mom')
                        connection.destroy()
                        connection.disconnect()
                    } else {
                        console.log('whata asda')
                        play(msg)
                    }
                } else {
                    console.log('excuse mee young man')
                    console.log(newState.status, oldState.status, AudioPlayerStatus.Idle)
                }
            })
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