var express = require('express');
var bodyParser = require('body-parser');
var https = require("https");
var request = require('request');
var path = require('path');

// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
//
// mongoose.connect('mongodb://drizzl:drizzltest@ds161146.mlab.com:61146/forecasts');
// mongoose.Promise = global.Promise;
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// var Forecast = mongoose.model('Forecast', myForecast);

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
  request(`https://api.darksky.net/forecast/8c3c8dc972b787fa631b37e0cf3da0d2/${req.body.locationstring}?exclude=minutely,hourly,daily,alerts,flags`, function (error, response, body) {
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
