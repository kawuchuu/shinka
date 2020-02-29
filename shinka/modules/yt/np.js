let player = require('./player');

module.exports.run = async (bot, msg) => {
    let npVid = player.serverQueue[msg.member.guild.id].np;
    console.log(npVid)
    bot.createMessage(msg.channel.id, {
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
                    value: npVid.channel,

                },
                {
                    name: 'Link',
                    value: npVid.url
                }
            ],
            thumbnail: {
                url: npVid.thumbnail
            }
        }
    })
}

module.exports.notCommand = false