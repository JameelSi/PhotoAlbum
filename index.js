const express = require('express'),
    bodyParser = require('body-parser'),
    routers = require('./routes/routes.js');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//to serve images css and js files
app.use(express.static('client', { index: false }))
app.use('/data', express.static(__dirname + '/data'))

app.use('/', routers);

const server = app.listen(port, () => {
    console.log('listening on port %s...', server.address().port);
});