let player = require('./player');

module.exports.run = async (bot, msg) => {
    let upNext = player.serverQueue[msg.member.guild.id].queue[0];
    if (!upNext) return msg.channel.send('Nothing up next!');
    msg.channel.send({
        embed: {
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
        }
    })
}

module.exports.help = {
    name: 'upnext [un]',
    category: 'YouTube',
    desc: 'Displays info about the video next in queue'
}