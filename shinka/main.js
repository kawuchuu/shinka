const eris = require('eris');
const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');

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

fs.readdir('./modules', (err, files) => {
    bot.commands = {};
    if (err) {
        return console.log(err);
    }
    files.forEach(f => {
        let mod;
        if (fs.lstatSync(`./modules/${f}`).isDirectory()) {
            fs.readdirSync(`./modules/${f}`).forEach(submod => {
                mod = require(`./modules/${f}/${submod}`);
                if (mod.notCommand) return;
                bot.commands[submod.substr(0, submod.length - 3)] = mod;
            })
        } else {
            mod = require(`./modules/${f}`);
            if (mod.notCommand) return;
            bot.commands[f.substr(0, f.length - 3)] = mod;
        }
    })
    console.log(bot.commands);
})

bot.on('messageCreate', (msg) => {
    if (!msg.content.startsWith('sh!')) return;
    let args = msg.content.split(' ').slice(1);
    let reqCmd = msg.content.split(' ')[0].substr(3);
    let command = bot.commands[reqCmd];
    if (command) {
        command.run(bot, msg, args)
    }
})

process.on("SIGINT", () => {
    bot.editStatus('invisible')
    bot.disconnect({reconnect: false});
    process.exit(0);
})

bot.connect();