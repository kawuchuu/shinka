module.exports.run = async (bot, msg) => {
    msg.channel.send(msg.content.substr(8));
}