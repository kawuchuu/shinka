//api used: nekos.life
const {get} = require('https');
const endpoints = require('./endpoints.json');

module.exports.run = async (bot, msg, args) => {
    let base = 'https://nekos.life/api/v2';
    let endType = 'sfw';
    let argIndex = 0;
    if (args[0] == 'nsfw' && !msg.channel.nsfw) {
        msg.channel.send('NSFW images can only be posted in NSFW channels!');
        return;
    }
    if (args[0] == 'nsfw') {
        endType = 'nsfw';
        argIndex = 1;
    }
    if (!endpoints[endType][args[argIndex]]) return msg.channel.send('Not a valid image type!');
    let editMsg = await msg.channel.send('Fetching awesome image...');
    let getURL = await new Promise((resolve, reject) => {
        get(`${base}${endpoints[endType][args[argIndex]]}`, res => {
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
                    resolve(parsed.url);
                } catch(err) {
                    reject(`Error: ${err.message}`);
                }
            })
        }).on('error', err => {
            reject(`Error: ${err.message}`);
        });
    });
    if (endType == 'nsfw') {
        editMsg.edit(`*Disclaimer: I, the author of this bot, do not endorse any of these NSFW images. If an inappropriate image is randomly picked, please remove the image immediately.*\n${getURL}`);
    } else {
        editMsg.edit(getURL);
    }
}

module.exports.help = {
    name: 'animeimg',
    category: 'Fun',
    desc: 'Sends a nice little anime image! NSFW images will only be shown in NSFW channels.',
    args: '[<type> | nsfw <type>]'
}