module.exports.run = async (bot, msg, args) => {
    console.log()
    let member = msg.member;
    if (msg.mentions.members) {
        member = msg.mentions.members.first().user;
    }
    let avatar = member.avatar;
    let id = member.id;
    let discr = member.discriminator;
    if (avatar != null) {
        msg.channel.send(`https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=512`);
    } else {
        msg.channel.send(`https://cdn.discordapp.com/embed/avatars/${discr % 5}.png`);
    }
}

module.exports.help = {
    name: 'avatar',
    category: 'Core',
    desc: "Sends the user's avatar image URL",
    args: '<user mention>'
}