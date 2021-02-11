module.exports.run = async (bot, msg) => {
    require('./np').run(bot, msg);
}

module.exports.help = {
    inherit: 'np'
}