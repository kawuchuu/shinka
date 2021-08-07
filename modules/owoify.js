const {get} = require('https');
const qs = require('querystring');

module.exports.run = async (bot, msg) => {
    let base = 'https://nekos.life/api/v2/owoify?';
    let fullArgs = msg.options.getString('text')
    if (fullArgs.length > 200) {
        msg.reply('You can only OwOify a max of 200 characters per request ‧º·(˚ ˃̣̣̥⌓˂̣̣̥ )‧º·˚');
        return;
    }
    base += qs.stringify({
        text: fullArgs
    });
    await msg.reply('OwOifying your message... ^w^');
    let getMsg = await new Promise((resolve, reject) => {
        get(base, res => {
            if (res.statusCode != 200) {
                res.resume();
                reject(`Failed with code: ${res.statusCode}`);
            }
            res.setEncoding('utf-8');
            let data = '';
            res.on('data', stuff => {
                data += stuff;
            });
            res.on('end', () => {
                try {
                    let parsed = JSON.parse(data);
                    resolve(parsed.owo);
                } catch(err) {
                    reject(`Error: ${err.message}`);
                }
            })
        }).on('error', err => {
            reject(`Error: ${err.message}`);
        });
    });
    msg.editReply(getMsg);
}

module.exports.help = {
    name: 'owoify',
    desc: "OwOify's youw cwte wittle mwessage UwU",
    options: [{
        name: 'text',
        type: 'STRING',
        description: 'Your twext u want me two OwOify :3',
        required: true
    }]
}