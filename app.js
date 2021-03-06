var express = require('express');
var bodyParser = require('body-parser');
var https = require("https");
var request = require('request');
var path = require('path');
require('dotenv').config();

var app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use('*/css',express.static('public/css'));
app.use('*/js',express.static('public/js'));
app.use('*/audio',express.static('public/audio'));
app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
})

app.post('/', function(req, res){
  // for Heroku
  // var DARKSKY_API_KEY = process.env.DARKSKY_API_KEY;
  request(`https://api.darksky.net/forecast/31fb2ee86b507e825d194fe061876f43/${req.body.locationstring}?exclude=minutely,hourly,daily,alerts,flags`, function (error, response, body) {
  // Print the error if one occurred
  console.log('error:', error);
  // Print the response status code if a response was received
  console.log('statusCode:', response && response.statusCode);
  // Print the api's response.
  console.log('body:', JSON.parse(body));
  res.render('forecast', { body });
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function(){
		console.log('Running on: ' + PORT);
});
