var express = require('express');
var socket = require('socket.io');

//app
var app = express();
var server = app.listen(3000);

app.use(express.static('public07'));
console.log('server is connected');

//socket
var io = socket(server);

io.on('connection', (socket) => {
  console.log("a user connected");
  //console.log(socket.id);

  socket.on('snakeLocation', (dataSnake) => {
    //console.log(data.xspeed);
    io.emit('snakeLocation', dataSnake); //1번-이
  });

  socket.on('keyEvent', (dataKey) => {
    //console.log(data);
    io.emit('keyEvent', dataKey);
  });

  socket.on('foodLocation', (dataFood) => {
    //console.log(data);
    io.emit('foodLocation', dataFood);
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
  });
});
