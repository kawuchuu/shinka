const Discord = require('discord.js');
let bot = new Discord.Client();
const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const path = require('path');
bot.isElectron = true;
bot.help = {};

try {
    console.log(`Testing for Electron: ${require('electron').app.getVersion()}`)
    console.log('Electron appears to be present!')
} catch(e) {
    bot.isElectron = false;
    console.log('Electron is not present!')
}

let moduleDir = './modules';

if (bot.isElectron && process.env.NODE_ENV === 'development') {
    moduleDir = path.resolve(__dirname, '../shinka/modules')
} else if (bot.isElectron) {
    moduleDir = `${require('electron').app.getAppPath()}/shinka/modules`;
}

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

fs.readdir(moduleDir, (err, files) => {
    bot.commands = {};
    if (err) {
        return console.log(err);
    }
    files.forEach(f => {
        let mod;
        let isDirectory = fs.lstatSync(`${moduleDir}/${f}`).isDirectory();
        if (!f.endsWith('.js') && !isDirectory) return;
        if (isDirectory) {
            fs.readdirSync(`${moduleDir}/${f}`).forEach(submod => {
                if (!submod.endsWith('.js')) return;
                mod = require(`${moduleDir}/${f}/${submod}`);
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
            mod = require(`${moduleDir}/${f}`);
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
})

bot.on('message', msg => {
    if (!msg.content.startsWith('sh!')) return;
    let args = msg.content.split(' ').slice(1);
    let reqCmd = msg.content.split(' ')[0].substr(3);
    let command = bot.commands[reqCmd];
    if (command) {
        command.run(bot, msg, args)
    }
})

process.on("SIGINT", () => {
    process.exit(0);
})