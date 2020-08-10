var express = require('express');
var socket = require('socket.io');

//app
var app = express();
var server = app.listen(3000);
var players = [];

app.use(express.static('public11'));
console.log('server is connected');

//socket
var io = socket(server);

io.on('connection', (socket) => {
  console.log("a user connected");
  //console.log(socket.id);
  socket.on('snakeLocation', (data) => {
    if(players.length === 0){
      players.push(data);
    }else{
      for(var j = 0; j < players.length; j++){
        if(players[j].id === data.id){
          players[j] = data;
          break;
        }
        if(j === players.length - 1){
          players.push(data);
        }
      }
    }
    console.log(players);
    io.emit('snakeLocation', players);
  });
  /*
  socket.on('keyEvent', (data) => {
    //console.log(data);
    io.emit('keyEvent', data);
  });
  */
/*
  socket.on('tailInfo', (data) => {
    console.log(data);
    io.emit('tailInfo', data);
  });
*/
  socket.on('foodLocation', (data) => {
    io.emit('foodLocation', data);
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
