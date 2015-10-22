/*
  A super-simple static server to
  host UI files
*/

var express = require('express');

var app = express();

app.use(express.static('static'));

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Static server listening at http://%s:%s', host, port);
});
