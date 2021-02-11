const Discord = require('discord.js');
let bot = new Discord.Client();
const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
bot.help = {};

bot.login(require('./config.json').token);
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
    bot.user.setActivity('in development uwu', { type: 'PLAYING' });
})

fs.readdir('./modules', (err, files) => {
    bot.commands = {};
    if (err) {
        return console.log(err);
    }
    files.forEach(f => {
        let mod;
        let isDirectory = fs.lstatSync(`./modules/${f}`).isDirectory();
        if (!f.endsWith('.js') && !isDirectory) return;
        if (isDirectory) {
            fs.readdirSync(`./modules/${f}`).forEach(submod => {
                if (!submod.endsWith('.js')) return;
                mod = require(`./modules/${f}/${submod}`);
                if (mod.notCommand) return;
                bot.commands[submod.substr(0, submod.length - 3)] = mod;
                if (mod.help) {
                    if (!mod.help.category) return;
                    if (!bot.help[mod.help.category]) bot.help[mod.help.category] = [];
                    let helpObj = {
                        name: mod.help.name
                    }
                    if (mod.help.args) helpObj['args'] = mod.help.args;
                    if (mod.help.desc) helpObj['desc'] = mod.help.desc;
                    bot.help[mod.help.category].push(helpObj);
                }
            })
        } else {
            mod = require(`./modules/${f}`);
            if (mod.notCommand) return;
            bot.commands[f.substr(0, f.length - 3)] = mod;
            if (mod.help) {
                if (!bot.help[mod.help.category]) bot.help[mod.help.category] = [];
                let helpObj = {
                    name: mod.help.name
                }
                if (mod.help.args) {
                    helpObj['args'] = mod.help.args;
                }
                bot.help[mod.help.category].push(helpObj);
            }
        }
    })
    console.log(bot.commands);
    console.log(bot.help);
})

bot.on('message', msg => {
    if (!msg.content.startsWith('sh!')) return;
    let args = msg.content.split(' ').slice(1);
    let reqCmd = msg.content.split(' ')[0].substr(3);
    let command = bot.commands[reqCmd];
    if (command) {
        command.run(bot, msg, args)
    } else {
        if (fs.existsSync(`./img/${reqCmd}.jpg`)) {
            msg.channel.send({files: [{
                attachment: `./img/${reqCmd}.jpg`,
                name: `${reqCmd}.jpg`
            }]})
        }
    }
})

process.on("SIGINT", () => {
    //bot.editStatus('invisible')
    //bot.disconnect({reconnect: false});
    process.exit(0);
})