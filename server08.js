var express = require('express');
var socket = require('socket.io');

//app
var app = express();
var server = app.listen(3000);
var players = [];

app.use(express.static('public08'));
console.log('server is connected');

//socket
var io = socket(server);

io.on('connection', (socket) => {
  console.log("a user connected");
  //console.log(socket.id);

  socket.on('snakeLocation', (data) => {
    //console.log(data.xspeed);
    io.emit('snakeLocation', data);
  });

  socket.on('keyEvent', (data) => {
    //console.log(data);
    io.emit('keyEvent', data);
  });

  socket.on('foodLocation', (data) => {
    //console.log(data);
    io.emit('foodLocation', data);
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
  });
});
