const express = require('express');
const router = express.Router();
const bot = require('bot');

router.use('/', (req, res, next) => {
    if (!bot.user) {
        res.status(404).send();
    }
    req.botuser = {
        username: bot.user.username,
        discriminator: bot.user.discriminator,
        id: bot.user.id,
        avatarURL: bot.user.dynamicAvatarURL()
    }
    next();
});

router.get('/', (req, res) => {
    res.status(200).send(req.botuser);
})

router.post('/updateAvatar', (req, res) => {
    let error = null;
    console.log('Updating bot avatar...')
    new Promise((resolve, reject) => {
        setTimeout(() => {
            reject('Error: Request timed out');
        }, 30000);
        bot.editSelf({avatar: req.body.image}).then(a => {
            console.log('Updated bot avatar');
        }).catch(err => {
            console.log(err)
            error = err.toString();
            return 
        }).then(() => {
            if (error != null) {
                res.status(429).send({err: error});
            } else {
                res.status(200).send({status: "OK"});
            }
            resolve();
        });
    }).catch(err => {
        res.status(500).send({err: err});
        console.log(err);
    })
});

module.exports = router;