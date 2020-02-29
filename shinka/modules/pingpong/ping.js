module.exports.run = async (bot, msg) => {
    let pingMessage = [
        "Hope you're having a fantastic day!",
        "As you can see, I'm alive!",
        "Reporting for duty.",
        "Hi! I'm new.",
        "Ready to take in commands!"
    ]
    let botPing = Date.now();
    bot.createMessage(msg.channel.id, 'Pinging...').then(i => {
        bot.editMessage(msg.channel.id, i.id, `**Pong!** ${pingMessage[Math.floor(Math.random() * (3 - 0))]} | Response Time: **${Math.round(parseInt(Date.now() - botPing))}ms**`)
    })
}