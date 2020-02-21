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
        avatarURL: bot.user.dynamicAvatarURL(),
        ver: require('../../package.json').version
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
            reject('Error: Request timed out. Are you changing your avatar too fast?');
        }, 15000);
        bot.editSelf({avatar: req.body.image}).then(a => {
            console.log('Updated bot avatar');
        }).catch(err => {
            console.log(err)
            error = err.toString();
        }).then(() => {
            if (error != null) {
                res.status(500).send({err: error});
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

router.post('/updateUsername', (req, res) => {
    let error = null;
    console.log('Updating bot username...')
    new Promise((resolve, reject) => {
        setTimeout(() => {
            reject('Error: Request timed out. Are you changing your username too fast?');
        }, 10000);
        bot.editSelf({username: req.body.name}).then(a => {
            console.log('Updated bot username');
        }).catch(err => {
            console.log(err)
            error = err.toString();
        }).then(() => {
            if (error != null) {
                res.status(500).send({err: error});
            } else {
                res.status(200).send({status: "OK"});
            }
            resolve();
        });
    }).catch(err => {
        res.status(500).send({err: err});
        console.log(err);
    })
})

module.exports = router;