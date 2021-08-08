let player = require('./player');

module.exports.run = async (bot, msg) => {
    if (!player.serverQueue[msg.guild.id]) return msg.reply('No queue exists for this server!')
    let np = player.serverQueue[msg.guild.id].np;
    let queue = player.serverQueue[msg.guild.id].queue;
    let queueList = 'Nothing left in the queue!';
    if (queue.length != 0) {
        queueList = '';
        queue.forEach((f, i) => {
            queueList += `${i + 1}. ${f.title}\n`;
        })
    }
    await msg.reply({
        embeds: [{
            title: ':notepad_spiral:  Queue',
            color: 0xff0000,
            fields: [
                {
                    name: 'Now Playing',
                    value: np.title
                },
                {
                    name: 'Queue',
                    value: queueList
                }
            ]
        }]
    })
}

module.exports.help = {
    name: 'queue',
    desc: "Displays the server's YouTube queue"
}