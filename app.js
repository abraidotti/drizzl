var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use('*/css',express.static('public/css'));
app.use('*/js',express.static('public/js'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
})

app.get('/forecasts/:id', function(req, res){
  res.send('You requested a forecast with the id of ' + req.params.id) + '.';
})

app.listen(3000);
