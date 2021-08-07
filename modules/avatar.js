module.exports.run = async (bot, msg) => {
    const member = msg.options.getUser('user')
    let avatar = member.avatar;
    let id = member.id;
    let discr = member.discriminator;
    if (avatar != null) {
        msg.reply(`https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=512`);
    } else {
        msg.reply(`https://cdn.discordapp.com/embed/avatars/${discr % 5}.png`);
    }
}

module.exports.help = {
    name: 'avatar',
    desc: "Sends the user's avatar image URL",
    options: [{
        name: 'user',
        type: 'USER',
        description: 'Select a user',
        required: true
    }]
}