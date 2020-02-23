const eris = require('eris');
const express = require('express');
const cors = require('cors');
const app = express();

let bot = new eris(require('./config.json').token);
app.use(express.json({limit: '100kb'}));
app.use(cors());
app.listen(64342, err => {
    if (err) return console.log('Failed to start express server!');
    console.log('Express server started');
})

bot.on('ready', () => {
    console.log("connected to discord");
    app.use('/status', (req, res) => {
        res.sendStatus(200);
    });
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

process.on("SIGINT", () => {
    bot.editStatus('invisible')
    bot.disconnect({reconnect: false});
    process.exit(0);
})

bot.connect();