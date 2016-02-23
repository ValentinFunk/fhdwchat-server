var express = require('express'),
    http = require('http');

var chat = require('./chat');

var app = express();

app.use(express.static('public/app'));
app.use(express.static('public'));

var server = http.createServer(app);
server.listen(80, function() {
  console.log("Static Content Server gestartet.");
});

chat(server);
