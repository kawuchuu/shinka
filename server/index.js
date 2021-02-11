const express = require('express');
const cors = require('cors')
const app = express()
const port = 3000;
const path = require('path');

let api = require('./api/api');
let webapp = require('./webapp/webapp');


app.use(express.json({limit: '8mb'}));
app.use(cors());
app.use('/api', api);
app.use('/', webapp);
app.use('/static', express.static(path.join(__dirname, '/webapp/public')));

app.set('views', path.join(__dirname, '/webapp/views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.listen(port, err => {
    if (err) {
        return console.log(`Failed to start the server! => ${err}`);
    }
    console.log(`Express listening on port ${port}`);
});