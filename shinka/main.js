const eris = require('eris')

let bot = new eris(require('./config.json').token);

bot.on('ready', () => {
    console.log("connected to discord");
})

bot.on('messageCreate', (msg) => {
    let args = msg.content.split(' ');
    switch(args[0]) {
        case "sh!ping":
            bot.createMessage(msg.channel.id, "pong yeah im working fuck off")
            break;
        case "sh!echo":
            bot.createMessage(msg.channel.id, `${msg.content.substr(8)}`).catch(err => {
                console.log(err);
            });
            break;
    }
})

bot.connect();