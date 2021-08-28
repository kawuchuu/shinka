const ytapi = require('simple-youtube-api');
const yt = new ytapi(require('../../config.json').ytkey);
const player = require('./player');
const { joinVoiceChannel } = require('@discordjs/voice');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports.run = async (bot, msg) => {
    msg.reply('Searching YouTube...');
    try {
        yt.searchVideos(msg.options.getString('query'), 5).then(results => {
            let fields = []
            let selectFields = []
            results.forEach((video, index) => {
                fields.push({
                    name: `${index + 1}. ${video.title}`,
                    value: `Channel: ${video.channel.title}\n[Watch Video](${video.url})`
                })
                selectFields.push({
                    label: `${video.title}`.substr(0, 100),
                    value: video.id,
                    description: `${video.channel.title}`.substr(0, 100)
                })
            })
            const searchSelectMenu = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('selectedQuery')
                        .setPlaceholder('Select a search result')
                        .addOptions(selectFields)
                )
            msg.editReply({
                content: `Please select a video from the list below:`,
                embeds: [{
                    title: ':mag_right: Search Results',
                    color: 0xff0000,
                    fields,
                    footer: {
                        text: `Search query: ${msg.options.getString('query')}`
                    }
                }],
                components: [searchSelectMenu]
            })
        })
    } catch(err) {
        console.error(err)
    }
}

module.exports.selectedQuery = async (bot, msg) => {
    const videoID = msg.values[0]
    joinVoiceChannel({
        channelId: msg.member.voice.channelId,
        guildId: msg.guild.id,
        adapterCreator: msg.member.guild.voiceAdapterCreator,
    })
    if (!player.serverQueue[msg.guild.id]) {
        player.serverQueue[msg.guild.id] = {
            queue: []
        }
    }
    yt.getVideoByID(videoID).then(video => {
        player.serverQueue[msg.guild.id].queue.push({
            url: video.url,
            title: video.title,
            channel: video.channel.title,
            channelUrl: video.channel.url,
            thumbnail: video.thumbnails.high.url,
            duration: parseInt(video.durationSeconds),
            durationDisplay: `${video.duration.minutes}:${video.duration.seconds}`
        });
        if (!player.serverQueue[msg.guild.id].np) {
            player.play(msg);
            msg.update({ content: `**Now Playing:** ${video.title}`, embeds: [], components: [] });
        } else {
            msg.update({ content: `**Added to queue:** ${video.title}`, embeds: [], components: [] });
        }
    })
}

module.exports.help = {
    name: 'search',
    desc: 'Search YouTube for a video',
    options: [{
        name: 'query',
        type: 'STRING',
        description: 'Your search query to YouTube',
        required: true
    }]
}