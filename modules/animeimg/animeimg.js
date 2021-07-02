//api used: nekos.life
const {get} = require('https');
const endpoints = require('./endpoints.json');

module.exports.run = async (bot, msg, args) => {
    let base = 'https://nekos.life/api/v2';
    let argIndex = 0;
    if (!endpoints[args[argIndex]]) return msg.channel.send('Not a valid image type!');
    let editMsg = await msg.channel.send('Fetching awesome image...');
    let getURL = await new Promise((resolve, reject) => {
        get(`${base}${endpoints[args[argIndex]]}`, res => {
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
    editMsg.edit(getURL);
}

module.exports.help = {
    name: 'animeimg',
    category: 'Fun',
    desc: 'Sends a nice little anime image!',
    args: '[<type>]'
}