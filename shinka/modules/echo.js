module.exports.run = async (bot, msg) => {
    bot.createMessage(msg.channel.id, msg.content.substr(8));
}