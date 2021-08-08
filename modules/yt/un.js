let player = require('./player');

module.exports.run = async (bot, msg) => {
    const queue = player.serverQueue[msg.guild.id];
    let upNext;
    if (!queue) {
        upNext = null
    } else {
        upNext = queue.queue[0]
    }
    if (!upNext) return msg.reply('Nothing up next!');
    msg.reply({
        embeds: [{
            title: ":track_next:  Up Next",
            color: 0xff0000,
            fields: [
                {
                    name: 'Title',
                    value: upNext.title
                },
                {
                    name: 'Channel',
                    value: `[${upNext.channel}](${upNext.channelUrl})`
                },
                {
                    name: 'Link',
                    value: upNext.url
                }
            ],
            thumbnail: {
                url: upNext.thumbnail
            }
        }]
    })
}

module.exports.help = {
    name: 'upnext [un]',
    desc: 'Displays info about the video next in queue'
}