let player = require('./player');

module.exports.run = async (bot, msg) => {
    let np = player.serverQueue[msg.member.guild.id].np;
    let queue = player.serverQueue[msg.member.guild.id].queue;
    let queueList = 'Nothing left in the queue!';
    if (queue.length != 0) {
        queueList = '';
        queue.forEach((f, i) => {
            queueList += `${i + 1}. ${f.title}\n`;
        })
    }
    bot.createMessage(msg.channel.id, {
        embed: {
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
        }
    })
}