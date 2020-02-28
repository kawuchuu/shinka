const ytdl = require('ytdl-core');
let serverQueue = {};

let play = (connection, msg, bot) => {
    let server = serverQueue[msg.member.guild.id];
    let stream = ytdl(server.queue[0]);
    connection.play(stream);
    server.queue.shift();
    server.dispatcher = connection;
    server.dispatcher.once('end', () => {
        stream.destroy();
        if (server.queue[0]) {
            play(connection, msg, bot);
        } else {
            connection.stopPlaying();
            bot.leaveVoiceChannel(server.dispatcher.channelID);
        }
    })
    server.dispatcher.on('error', err => {
        stream.destroy();
        server.dispatcher.stopPlaying();
        console.log(err);
        if (server.queue[0]) {
            play(connection, msg, bot);
        } else {
            connection.stopPlaying();
            bot.leaveVoiceChannel(server.dispatcher.channelID);
        }
    })
}

module.exports.serverQueue = serverQueue;
module.exports.play = play;
module.exports.notCommand = true;