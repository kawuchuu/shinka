let player = require('./player');

let timeFormat = s => {
    if (isNaN(s)) return '-:--'
    let min = Math.floor(s / 60);
    let sec = Math.floor(s - (min * 60));
    if (sec < 10){ 
        sec = `0${sec}`;
    }
    return `${min}:${sec}`;
}

module.exports.run = async (bot, msg) => {
    let npVid = player.serverQueue[msg.member.guild.id].np;
    let dispDuration = player.serverQueue[msg.member.guild.id].dispatcher.totalStreamTime / 1000;
    let progressBar = '';
    let currentTimePretty = timeFormat(dispDuration);
    if (currentTimePretty == '-:--') progressBar = '░░░░░░░░░░░░░░░░░░░░'
    let progressFill = (dispDuration/npVid.duration) * 20;
    let progressLeft = 20 - progressFill;
    for (i=0; i < progressFill; i++) {
        progressBar += '█'
    }
    for (i=0; i < progressLeft; i++) {
        progressBar += '░'
    };
    msg.channel.send({
        embed: {
            title: ":notes:  Now Playing",
            color: 0xff0000,
            fields: [
                {
                    name: 'Title',
                    value: npVid.title
                },
                {
                    name: 'Channel',
                    value: `[${npVid.channel}](${npVid.channelUrl})`,

                },
                {
                    name: 'Link',
                    value: npVid.url
                },
                {
                    name: 'Progress',
                    value: `${currentTimePretty} - ${progressBar} - ${npVid.durationDisplay}`
                }
            ],
            thumbnail: {
                url: npVid.thumbnail
            }
        }
    })
}

module.exports.help = {
    name: 'nowplaying [np]',
    category: 'YouTube',
    desc: 'Displays info about the currently playing video'
}