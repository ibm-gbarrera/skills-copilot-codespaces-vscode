//Create web server
var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var url = require('url');
var comments = require('./comments');

var server = http.createServer(function(request, response) {
  var urlPath = url.parse(request.url).pathname;
  var filePath = '.' + urlPath;
  if (filePath == './') {
    filePath = './index.html';
  }
  var extname = path.extname(filePath);
  var contentType = mime.lookup(extname);
  fs.exists(filePath, function(exists) {
    if (exists) {
      fs.readFile(filePath, function(error, content) {
        if (error) {
          response.writeHead(500);
          response.end();
        } else {
          response.writeHead(200, {
            'Content-Type': contentType
          });
          response.end(content, 'utf-8');
        }
      });
    } else {
      response.writeHead(404);
      response.end();
    }
  });
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {
  socket.on('message', function(data) {
    var comment = {