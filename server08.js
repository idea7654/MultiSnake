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
    io.emit('snakeLocation', players);
  });

  socket.on('keyEvent', (dataKey) => {
    io.emit('keyEvent', dataKey);
  });
  socket.on('foodLocation', (dataFood) => {
    io.emit('foodLocation', dataFood);
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
    players.forEach((element) => {
      if(element.id === socket.id){
        var index = players.indexOf(element);
        players.splice(index, 1);
      }
    });
  });
});
