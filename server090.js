var express = require('express');
var socket = require('socket.io');

//app
var app = express();
var server = app.listen(3000);
var players = [];

app.use(express.static('public09'));
console.log('server is connected');

//socket
var io = socket(server);

io.on('connection', (socket) => {
  console.log("a user connected");
  //console.log(socket.id);
  /*
  socket.on('snakeLocation', (data) => {
    //console.log(data.xspeed);
    io.emit('snakeLocation', data);
  });*/

  //빈어레이 -> 클라이언트값 삽입 ->
  //채워있는 어레이 -> 검사 -> 덮어씌우기

  //1번 - if 어레이가 비어있다면 -> 클라이언트값 어레이에 삽입
  //2번 - 안비어있다면 -> 아이디가 같은지 검사 -> 같으면 덮어씌우기
  //3번 - 안비어있다면 -> 아이디가 같은지 검사 -> 같지 않으면 어레이에 추가

  socket.on('userInfo', () => {
    players.push(socket.id);
    io.emit('userInfo', players); //모든 스네이크들의 값
  });

  socket.on('tailInfo', (data) => {
    console.log(data);
    io.emit('tailInfo', data);
  });

  socket.on('foodLocation', (data) => {
    //console.log(data);
    io.emit('foodLocation', data);
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
    var index = players.indexOf(socket.id);
    players.splice(index, 1);
  });
});
