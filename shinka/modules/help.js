module.exports.run = async (bot, msg, args) => {
    let helpColour = 0x00ff00;
    let availableCategories = Object.keys(bot.help);
    let lowerAvCat = [];
    availableCategories.forEach(category => {
        lowerAvCat.push(category.toLowerCase());
    })
    if (args.length == 0) {
        let embedCategories = '';
        availableCategories.forEach(category => {
            if (category)
            embedCategories += `${category}\n`
        });
        msg.channel.send({embed: {
            title: 'Help',
            fields: [
                {
                    name: 'Available categories',
                    value: embedCategories
                }
            ],
            color: helpColour,
            footer: {
                text: "To view help for individual commands, type sh!help [<command> | <category> <command>]"
            }
        }});
        return;
    }
    let sendCmdHelp = cmd => {
        if (cmd.inherit) {
            sendCmdHelp(bot.commands[cmd.inherit].help);
            return;
        }
        let fields = [{
            name: 'Category',
            value: cmd.category
        }]
        if (cmd.desc) {
            fields.push({
                name: 'Description',
                value: cmd.desc
            })
        }
        if (cmd.args) {
            fields.push({
                name: 'Arguments',
                value: cmd.args
            })
        }
        msg.channel.send({embed: {
            title: `Help for ${cmd.name}`,
            fields: fields,
            color: helpColour
        }})
    }
    let categoryIndex = lowerAvCat.indexOf(args[0].toLowerCase());
    let cmdSelect = Object.keys(bot.commands).indexOf(args[0].toLowerCase());
    if (categoryIndex !== -1) {
        let categoryName = availableCategories[categoryIndex];
        let categoryNameLower = lowerAvCat[categoryIndex];
        if (args[1]) {
            cmdSelect = Object.keys(bot.commands).indexOf(args[1].toLowerCase());
            if (cmdSelect == -1) {
                msg.channel.send('Unknown command.');
                return;
            }
            let cmd = bot.commands[args[1].toLowerCase()].help;
            if (cmd.category.toLowerCase() !== categoryNameLower) {
                msg.channel.send("That command does not belong in this category.");
            } else {
                sendCmdHelp(cmd);
            }
            return;
        }
        let cmds = '';
        bot.help[categoryName].forEach(cmd => {
            cmds += `${cmd.name}\n`;
        })
        msg.channel.send({embed: {
            title: `Help for ${categoryName}`,
            fields: [
                {
                    name: 'Available commands',
                    value: cmds
                }
            ],
            color: helpColour
        }})
    } else if (cmdSelect !== -1) {
        let cmd = bot.commands[args[0].toLowerCase()].help;
        if (!cmd) {
            msg.channel.send('Unknown category/command.');
            return;
        }
        sendCmdHelp(cmd);
    } else {
        msg.channel.send('Unknown category/command.');
    }
}