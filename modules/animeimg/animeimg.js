//api used: nekos.life
const {get} = require('https');
const endpoints = require('./endpoints.json');
const { MessageActionRow, MessageSelectMenu } = require('discord.js')

const sendImgRequest = async (msg, type) => {
    const base = 'https://nekos.life/api/v2';
    const getURL = await new Promise((resolve, reject) => {
        get(`${base}${endpoints[type]}`, res => {
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
    return await getURL
}

module.exports.run = async (bot, msg) => {
    if (msg.options.getString('type') && !endpoints[msg.options.getString('type')]) {
        return msg.reply('Not a valid image type!');
    } else if (!msg.options.getString('type')) {
        let types = []
        Object.keys(endpoints).forEach(f => {
            types.push({
                label: f,
                value: f
            })
        })
        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('selectedType')
                    .setPlaceholder('Select image type')
                    .addOptions(types)
            )
        return await msg.reply({ content: 'Please select an image type:', components: [row] })
    }
    await msg.reply('Fetching awesome image...');
    const getURL = await sendImgRequest(msg, msg.options.getString('type'))
    msg.editReply(getURL);
}

module.exports.selectedType = async (bot, msg) => {
    await msg.update({ content: 'Fetching awesome image...', components: [] });
    const getURL = await sendImgRequest(msg, msg.values[0])
    msg.editReply(getURL)
}

module.exports.help = {
    name: 'animeimg',
    desc: 'Sends a nice little anime image!',
    options: [{
        name: 'type',
        type: 'STRING',
        description: 'The image type',
        required: false
    }]
}