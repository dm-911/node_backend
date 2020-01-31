const express = require('express');
const bodyParser = require('body-parser');
// This will be our application entry.
const http = require('http');
// Set up the express app
const app = express();
global.sequelize = require('sequelize');
// global.logger = require('morgan');
global.jsonParser = bodyParser.json();
global.jwt = require('jwt-simple');
global.token = "xxx";
var models = require("./models");
// Log requests to the console.
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization, Access-Control-Allow-Headers,application/json");
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();

});


models.sequelize.sync().then(function () {
    console.log("Database Connected!!!");

}).catch(function (err) {
    console.log(err, "Something Went Wrong While Connecting to database");
})
app.use('/main', require('./controllers/main'))

// Setup a default catch-all route that sends back a welcome message in JSON format.
// app.get('*', (req, res) => res.status(200).send({
//     message: 'Welcome to the beginning of nothingness.',
// }));


app.get('/test', function (req, res) {
    res.sendFile(__dirname + '/Disp/test.html');
});


const port = parseInt(process.env.PORT, 10) || 8000;
app.set('port', port);
const server = http.createServer(app);
server.listen(port, function () {
    console.log("Listening On :::", port)
});
module.exports = app;