const express = require('express');
//const cors = require('cors');
const app = express();
const { Server } = require('socket.io');
const { bot } = require('../main');
const http = require('http').createServer(app)
const cors = require('cors')

const io = new Server(http, {
    serveClient: false,
    cors: {
        origin: 'http://localhost:8080',
        methods: ['GET', 'POST'],
        transports: ['websocket', 'polling'],
        credentials: true,
        allowedHeaders: 'state'
    },
    allowEIO3: true
})

bot.fetchApplication().then(app => {
    bot.application = app
})

module.exports.startServer = () => {
    app.use(express.json({limit: '100kb'}));

    app.use(cors({
        origin: 'http://localhost:8080',
        methods: ['GET', 'POST', 'PUT'],
        allowedHeaders: ['state']
    }))

    // to prevent random apps from sending requests. this is not really authentication.
    app.use((req, res, next) => {
        if (req.headers.state == bot.state) next()
        else res.sendStatus(401)
    })

    app.use(express.json())

    app.use('/api', require('./router'))

    http.listen(64342, 'localhost', err => {
        if (err) return console.log('Failed to start express server!');
        console.log('Express server started');
    })
}

module.exports.io = io
