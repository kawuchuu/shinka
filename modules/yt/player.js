const ytdl = require('ytdl-core');
const { bot } = require('../../main')
let serverQueue = {np: null};

const play = (connection, msg, channel) => {
    let server;
    if (channel) {
        server = serverQueue[channel.guild.id];
    } else {
        server = serverQueue[msg.member.guild.id];
    }
    let stream = ytdl(server.queue[0].url);
    server.dispatcher = connection.play(stream);
    server.connection = connection;
    server.np = server.queue[0];
    server.queue.shift();
    if (bot.serverEnabled) {
        const io = require('../../server').io
        io.emit('ytPlayerMetadata', {
            title: server.np.title,
            channel: {
                name: server.np.channel,
                url: server.np.channelUrl
            },
            url: server.np.url
        })
        let interval;
        server.dispatcher.once('start', () => {
            interval = setInterval(() => {
                io.emit('ytPlayerUpdate', {
                    currentTime: server.dispatcher.totalStreamTime / 1000,
                    duration: server.np.duration
                })
            }, 1000)
        })
        server.dispatcher.once('finish', () => {
            clearInterval(interval)
        })
    }
    server.dispatcher.once('finish', () => {
        console.log('done')
        stream.destroy();
        if (server.queue[0]) {
            play(connection, msg, channel);
        } else {
            connection.channel.leave();
            server.np = null;
        }
    })
    server.dispatcher.on('error', err => {
        stream.destroy();
        server.dispatcher.end();
        console.log(err);
        if (!channel) {
            msg.channel.send(`Unfortunately, an error occurred.\nDetails: \`${err}\`\nThis error was logged to the console.`)
        }
        if (server.queue[0]) {
            play(connection, msg, channel);
        } else {
            connection.channel.leave();
            server.np = null;
        }
    })
}

module.exports.serverQueue = serverQueue;
module.exports.play = play;
module.exports.notCommand = true;