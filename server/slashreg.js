const { bot } = require('../main');
const router = require('express').Router();

router.put('/updateGuild', async (req, res) => {
    const cmds = Object.keys(bot.commands)
    let prepCmds = []
    cmds.forEach(cmd => {
        if (!bot.commands[cmd].help) return
        const cmdHelp = bot.commands[cmd].help
        let prepCmd = {
            name: cmd,
            description: cmdHelp.desc ? cmdHelp.desc : 'no desc'
        }
        if (cmdHelp.options) prepCmd.options = cmdHelp.options
        prepCmds.push(prepCmd)
    })
    await bot.guilds.cache.get(req.query.guild)?.commands.set(prepCmds)
    res.sendStatus(200)
})

module.exports = router