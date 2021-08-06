const player = require('./player');
const ytapi = require('simple-youtube-api');
const yt = new ytapi(require('../../config.json').ytkey);
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports.run = async (bot, msg) => {
    joinVoiceChannel({
        channelId: msg.member.voice.channelId,
        guildId: msg.member.guild.id,
        adapterCreator: msg.member.guild.voiceAdapterCreator,
    })
    await msg.reply('Searching YouTube...');
    try {
        yt.searchVideos(msg.options.getString('query'), 2).then(results => {
            if (!player.serverQueue[msg.member.guild.id]) {
                player.serverQueue[msg.member.guild.id] = {
                    queue: []
                }
            }
            //so we can get the duration...
            yt.getVideoByID(results[0].id).then(async video => {
                player.serverQueue[msg.member.guild.id].queue.push({
                    url: video.url,
                    title: video.title,
                    channel: video.channel.title,
                    channelUrl: video.channel.url,
                    thumbnail: video.thumbnails.high.url,
                    duration: parseInt(video.durationSeconds),
                    durationDisplay: `${video.duration.minutes}:${video.duration.seconds}`
                });
                if (!player.serverQueue[msg.member.guild.id].np) {
                    player.play(msg);
                    await msg.editReply(`**Now Playing:** ${results[0].title}`);
                } else {
                    await msg.editReply(`**Added to queue:** ${results[0].title}`);
                }
                console.log(video.durationSeconds);
            })
        })
    } catch(err) {
        console.log(err);
    }
}

module.exports.help = {
    name: 'play',
    options: [{
        name: 'query',
        type: 'STRING',
        description: 'Your search query to YouTube',
        required: true
    }],
    desc: 'Plays the first search result in a voice channel'
}