const express = require('express');
const router = express.Router();
const bot = require('bot');

router.use('/:id', (req, res, next) => {
    req.guild = bot.guilds.find(guild => {
        return guild.id == req.params.id;
    });
    if (!req.guild) {
        res.status(404).send();
    }
    next();
});

router.use('/:id/member/:memId', (req, res, next) => {
    req.guild = bot.guilds.find(guild => {
        return guild.id == req.params.id;
    });
    if (!req.guild) {
        res.status(404).send();
    }

    req.member = req.guild.members.find(member => {
        return member.id == req.params.memId;
    });
    if (!req.member) {
        res.status(404).send();
    }
    next();
});

router.use('/:id/channel/:chanId', (req, res, next) => {
    req.guild = bot.guilds.find(guild => {
        return guild.id == req.params.id;
    });
    if (!req.guild) {
        res.status(404).send();
    }

    req.channel = req.guild.channels.find(channel => {
        return channel.id == req.params.chanId;
    });
    if (!req.channel) {
        res.status(404).send();
    }
    next();
})

router.use('/', (req, res, next) => {
    let guildsList = [];
    let guilds = bot.guilds.keys();
    for (i = 0; i < bot.guilds.size; i++) {
        guildsList.push(guilds.next().value);
    }
    req.guilds = guildsList;
    next();
});

router.get('/:id', (req, res) => {
    let guild = req.guild;
    if (!guild) return;
    let guildInfo = {
        name: guild.name,
        memberCount: guild.memberCount,
        region: guild.region,
        createdAt: guild.createdAt,
        iconURL: guild.iconURL,
        ownerID: guild.ownerID,
        unavailable: guild.unavailable
    };
    res.status(200).send(guildInfo);
});

router.get('/:id/member/:memId', (req, res) => {
    let member = req.member;
    if (!member) return;
    memberInfo = {
        name: member.username,
        discriminator: member.discriminator,
        status: member.status,
        avatarURL: member.avatarURL,
        isBot: member.bot,
        nick: member.nick,
        createdAt: member.createdAt,
        permission: member.permission,
        joinedAt: member.joinedAt
        
    }
    res.status(200).send(memberInfo);
});

router.post('/:id/channel/:chanId/sendMsg', (req, res) => {
    let channel = req.channel.id;
    let msg = req.body.msg;
    console.log(msg)
    bot.createMessage(channel, msg);
    res.sendStatus(200);
})

router.get('/', (req, res) => {
    res.status(200).send(req.guilds);
})

module.exports = router;