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
  socket.on('snakeLocation', (dataSnake) => {
    if(players.length === 0){
      players.push(dataSnake);
    }else{
      for(var j = 0; j < players.length; j++){
        if(players[j].id === dataSnake.id){
          players[j] = dataSnake;
          break;
        }
        if(j === players.length - 1){
          players.push(dataSnake);
        }
      }
    }
    console.log(players);
    io.emit('snakeLocation', players);
  });

  socket.on('keyEvent', (dataKey) => {
    //console.log(data);
    io.emit('keyEvent', dataKey);
  });
/*
  socket.on('tailInfo', (data) => {
    console.log(data);
    io.emit('tailInfo', data);
  });
*/
  socket.on('foodLocation', (dataFood) => {
    //console.log(data);
    io.emit('foodLocation', dataFood);
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
    var index = players.indexOf(socket.id);
    players.splice(index, 1);
  });
});
