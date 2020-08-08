var express = require('express');
var socket = require('socket.io');

//app
var app = express();
var server = app.listen(3000);
//socket.io 공식문서 기본문법

app.use(express.static('public02'));
console.log('server is connected');

//Socket
var io = socket(server);
io.on('connection', (socket) => {
  console.log("a user connected");
});
