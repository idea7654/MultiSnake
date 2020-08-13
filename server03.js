var express = require('express');
var socket = require('socket.io');

//app
var app = express();
var server = app.listen(3000);

app.use(express.static('public03'));
console.log('server is connected');

//socket
var io = socket(server);

io.on('connection', (socket) => {
  console.log("a user connected");
  console.log(socket.id);

  socket.on('snakeLocation', (dataSnake) => {
    console.log(dataSnake);
  });

  socket.on('disconnect', () => {
    console.log("disconnected");
  });
});
