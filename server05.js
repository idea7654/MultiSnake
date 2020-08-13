var express = require('express');
var socket = require('socket.io');

var app = express();
var server = app.listen(3000);

app.use(express.static('public05'));
console.log('server is connected');

//socket
var io = socket(server);

io.on('connection', (socket) => {
  console.log("a user connected");
  console.log(socket.id);

  socket.on('snakeLocation', (dataSnake) => {
    io.emit('snakeLocation', dataSnake);
  });

  socket.on('foodLocation', (dataFood) => {
    io.emit('foodLocation', dataFood);
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
  });
});

//socket.emit('이벤트명', 보낼 데이터값)
//socket.on('이벤트명', (받을 데이터 변수) => {
//  데이터 처리
//});
