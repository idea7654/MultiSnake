'use strict';
var vcanvas, ctx;
var s;
var scl = 20;
var food = {x: null, y: null};
var socket = io();
var key = {l:0, r:0, u:0, d:0};

function sendData() {
  socket.emit('snakeLocation', s);
}

function Snake(id, x, y, xspeed, yspeed) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.xspeed = xspeed;
    this.yspeed = yspeed;
    this.tail = [];     // new

    this.update = function () {
        // new -----------------
        var i;

        for (i = this.tail.length - 1; i > 0; i -= 1) {
            this.tail[i] = this.tail[i - 1];
        }
        this.tail[0] = {x: this.x, y: this.y};

        this.x += this.xspeed * scl;
        this.y += this.yspeed * scl;
        // -----------------------

        if (this.x < 0) { this.x = 0; }
        if (this.x + scl > vcanvas.width) { this.x = vcanvas.width - scl; }
        if (this.y < 0) { this.y = 0; }
        if (this.y + scl > vcanvas.height) { this.y = vcanvas.height - scl; }
    };

    this.eat = function (pos) {
        var dx = this.x - pos.x, dy = this.y - pos.y, d;

        d = Math.sqrt(dx * dx + dy * dy);
        if (d < 1) {
            this.tail.push({x: null, y: null});
            //emit
            return true;
        } else {
            return false;
        }
    };

    this.dir = function (x, y) {
        this.xspeed = x;
        this.yspeed = y;
    };

    this.draw = function () {
        // new -----------------
        var i;
        ctx.fillStyle = 'gray';
        for (i = 0; i < this.tail.length - 1; i += 1) {
            ctx.fillRect(this.tail[i].x, this.tail[i].y, scl, scl);
        }
        // --------------------

        ctx.fillStyle = 'black';
        ctx.fillRect(this.x, this.y, scl, scl);
    };
}

function clearCanvas() {
    ctx.clearRect(0, 0, vcanvas.width, vcanvas.height);
}

function pickLocation() {
    var cols, rows;

    cols = Math.floor(vcanvas.width / scl);
    rows = Math.floor(vcanvas.height / scl);

    food.x = Math.floor(Math.random() * cols) * scl;
    food.y = Math.floor(Math.random() * rows) * scl;

    socket.emit('foodLocation', food);
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, scl, scl);
}

function update() {
    if (key.l) { s.dir(-1, 0); }
    if (key.r) { s.dir(1, 0); }
    if (key.u) { s.dir(0, -1); }
    if (key.d) { s.dir(0, 1); }
}

function gameLoop() {
    sendData();
    clearCanvas();
    update();
    s.update();
    if (s.eat(food)) {
      pickLocation();
    }
    drawFood();
    s.draw();
}

function init() {
    vcanvas = document.getElementById("myCanvas");
    ctx = vcanvas.getContext("2d");
    s = new Snake(socket.id, 0, 0, 0, 0);
    pickLocation();
    setInterval(gameLoop, 80);
}

// key control

function set_key() {
  key.l = key.r = key.u = key.d = 0;

  if (event.keyCode === 37) { key.l = 1; }
  if (event.keyCode === 39) { key.r = 1; }
  if (event.keyCode === 38) { key.u = 1; }
  if (event.keyCode === 40) { key.d = 1; }

  //socket.emit('keyEvent', key);
} //키데이터 넘기기

document.onkeydown = set_key;

//socket

socket.on('foodLocation', (foodData) => {
  food = foodData;
});

socket.on('snakeLocation', (snakeData) => {
  snakeData.forEach((snakeElement) => {
    if(snakeElement.id === socket.id){
      var index = snakeData.indexOf(snakeElement);
      snakeData.splice(index, 1);
      for(var j in snakeData){
        ctx.fillRect(snakeData[j].x, snakeData[j].y, scl, scl);
        ctx.fillStyle = "blue";
      }
    }
  });
});
/*
socket.on('keyEvent', (keyData) => {
  key = keyData;
});
*/
