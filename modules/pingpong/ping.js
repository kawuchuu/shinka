module.exports.run = async (bot, msg) => {
    let pingMessage = [
        "Hope you're having a fantastic day!",
        "As you can see, I'm alive!",
        "Reporting for duty.",
        "Hi! I'm new.",
        "Ready to take in commands!"
    ]
    let botPing = Date.now();
    msg.channel.send('Pinging...').then(i => {
        i.edit(`**Pong!** ${pingMessage[Math.floor(Math.random() * (3 - 0))]} | Response Time: **${Math.round(parseInt(Date.now() - botPing))}ms**`)
    })
}

module.exports.help = {
    name: 'ping',
    category: 'Core',
    desc: 'Sends a message with the response rate'
}