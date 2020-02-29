let player = require('./player');

module.exports.run = async (bot, msg) => {
    let upNext = player.serverQueue[msg.member.guild.id].queue[0];
    if (!upNext) return bot.createMessage(msg.channel.id, 'Nothing up next!');
    bot.createMessage(msg.channel.id, {
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
                    value: upNext.channel,

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