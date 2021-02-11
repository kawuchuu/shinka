const {get} = require('https');
const url = require('url');
const qs = require('querystring');

module.exports.run = async (bot, msg, args) => {
    let base = 'https://nekos.life/api/v2/owoify?';
    let fullArgs = msg.content.substr(9);
    if (fullArgs.length > 200 && (args[0] == '-f' || args[0] == '--force')) {
        fullArgs = fullArgs.substr(4,200);
        console.log(args[0])
    } else if (fullArgs.length > 200) {
        msg.channel.send('You can only OwOify a max of 200 characters per request ‧º·(˚ ˃̣̣̥⌓˂̣̣̥ )‧º·˚');
        return;
    } else if (args[0] == '-f' || args[0] == '--force') {
        fullArgs = fullArgs.substr(4);
    }
    base += qs.stringify({
        text: fullArgs
    });
    let editMsg = await msg.channel.send('OwOifying your message... ^w^');
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
                    console.log(parsed)
                    resolve(parsed.owo);
                } catch(err) {
                    reject(`Error: ${err.message}`);
                }
            })
        }).on('error', err => {
            reject(`Error: ${err.message}`);
        });
    });
    editMsg.edit(getMsg);
}

module.exports.help = {
    name: 'owoify',
    category: 'Fun',
    desc: "OwOify's youw cwte wittle mwessage UwU",
    args: '<message>'
}