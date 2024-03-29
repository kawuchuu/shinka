const { Client, Intents } = require('discord.js');
const fs = require('fs');
const path = require('path');

const gwIntents = new Intents()

gwIntents.add()

let bot = new Client({
    intents: [
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILDS
    ]
});

bot.isElectron = true;
bot.help = {};
bot.msgAfter = {};

module.exports.bot = bot

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

const generateState = () => {
    if (process.argv.indexOf('--devState') !== -1) return 'dev'
    let text = ''
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < 30; i++) {
        text += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return text
}

bot.state = generateState()

if (bot.isElectron) {
    const { ipcMain } = require('electron')
    ipcMain.handle('state', () => {
        return bot.state
    })
}

bot.login(require('./config.json').token);

bot.on('ready', () => {
    if (bot.isElectron || process.argv.indexOf('--useServer') !== -1) {
        bot.serverEnabled = true
        require('./server').startServer()
    }
    console.log("connected to discord");
    bot.user.setActivity('wahoo discord api v9 migration', { type: 'PLAYING' });
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

bot.on('interactionCreate', interaction => {
    if (interaction.isCommand()) {
        const cmd = bot.commands[interaction.commandName]
        if (cmd) {
            cmd.run(bot, interaction)
        }
    } else if (interaction.isSelectMenu()) {
        const cmd = bot.commands[interaction.message.interaction?.name]
        if (cmd) {
            cmd[interaction.customId](bot, interaction)
        }
    }
})

process.on("SIGINT", async () => {
    console.log('Goodbye!')
    bot.user.setStatus('offline')
    bot.destroy()
    process.exit(0);
})