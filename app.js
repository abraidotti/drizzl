var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.set('view engine', 'ejs');

app.use('*/css',express.static('public/css'));
app.use('*/js',express.static('public/js'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
})

app.get('/forecast', function(req, res){
  res.render('forecast', { qs: req.query });
});

app.get('/forecast/:id', function(req, res){
  res.render('forecast', {id: req.params.id}) + '.';
})

app.listen(3000);
