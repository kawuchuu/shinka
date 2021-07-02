module.exports.run = async (bot, msg) => {
    require('./un').run(bot, msg);
}

module.exports.help = {
    inherit: 'un'
}