const express = require('express');
const cors = require('cors');
const app = express();

const generateState = () => {
    if (process.argv.indexOf('--devState') !== -1) return 'dev'
    let text = ''
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < 30; i++) {
        text += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return text
}

module.exports.startServer = () => {
    app.use(express.json({limit: '100kb'}));
    app.use(cors());

    // to prevent random apps from sending requests. this is not really authentication.
    app.use((req, res, next) => {
        if (req.headers.state == app.get('state')) next()
        else res.sendStatus(401)
    })

    app.set('state', generateState())

    app.use('/api', require('./router'))

    app.listen(64342, 'localhost', err => {
        if (err) return console.log('Failed to start express server!');
        console.log('Express server started');
    })
}