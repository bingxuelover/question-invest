var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.use(express.static('public'));

var server = app.listen(5000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('运行地址 http://%s:%s', host, port);
});
