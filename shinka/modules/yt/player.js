const ytdl = require('ytdl-core');
let serverQueue = {};

let play = (connection, msg, bot) => {
    let server = serverQueue[msg.member.guild.id];
    try {
        connection.play(ytdl(server.queue[0]));
        server.queue.shift();
        server.dispatcher = connection;
        server.dispatcher.once('end', () => {
            if (server.queue[0]) {
                play(connection, msg, bot);
            } else {
                connection.stopPlaying();
                bot.leaveVoiceChannel(server.dispatcher.channelID);
            }
        })
    } catch(err) {
        console.log(err);
    }
}

module.exports.serverQueue = serverQueue;
module.exports.play = play;
module.exports.notCommand = true;