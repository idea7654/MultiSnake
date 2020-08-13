# MultiSnakeGame

___

- 1단계 - Express를 통해서 정적파일 제공
- 2단계 - 소켓 연결
- 3단계 - emit이벤트로 콘솔출력해보기, 소켓 아이디 출력
- 4단계 - 소켓으로 한쪽 미러링 구현(x, y좌표 쏴주고 클라이언트에서 해당 좌표를 모든 연결된 소켓객체에 연결)
- 5단계 - 먹이 위치 미러링 구현
- 6단계 - 양쪽 미러링 구현(keyEvent를 소켓으로 구현)
- 7단계 - Snake객체에 소켓Id값을 넣어 서버로 전송
- 8단계 - 클라이언트의 객체정보를 받아와서 서버에 한번에 저장, 다시 클라이언트로 전송
- 9단계 - 멀티플레이 구현(head만)
- 10단계 - 멀티플레이 완성
- 11단계 - 터치이벤트 구현

___

## 1단계

___

Express를 사용하여 서버를 실행시키고 express.static을 사용하여 정적파일을 연결한다.

```javascript
var express = require('express');
var app = express();

app.use(express.static('public01'));
var server = app.listen(3000);
console.log('server is connected'); //Express를 사용하여 서버를 실행하고, express.static으로 정적파일 제공
```

___

## 2단계

___

클라이언트(js파일)에서 ``socket.io`` 객체 생성

```javascript
var socket = io();
```

HTML에 클라이언트에서 socket.io을 사용할 수 있도록 head부분에 다음 코드 추가

```javascript
<script src="http://localhost:3000/socket.io/socket.io.js"></script>
```

서버(server.js)에서 ``socket.io``을 사용할 수 있도록 다음과 같은 코드 추가 작성

```javascript
var socket = require('socket.io');
var io = socket(server);
```

서버측에서 ``socket.io`` 을 사용하는 방법

```javascript
io.on('connection', (socket) => {
  //소켓이벤트
  
  socket.on('disconnect', () => {
		console.log('disconnected');   
  });//연결이 해제되었을 때 발생하는 이벤트
}); //연결되었을 때 발생하는 이벤트
```

___

## 3단계

___

``Socket.io`` 를 통해 접속하는 모든 클라이언트는 고유의 ID를 갖고 있으며 다음과 같이 접근할 수 있다.

```javascript
io.on('connection', (socket) => {
  console.log(socket.id); //socket의 id를 콘솔에 출력
});
```

``socket.io`` 는 이벤트를 통해 데이터를 전달하며 다음과 같이 사용한다.

```javascript
io.on('connection', (socket) => {
  socket.emit('이벤트명', 데이터);
  socket.on('이벤트명', (데이터) => {
    //데이터 처리
  });
});
```

___

## 4단계

___

한쪽에서 움직이면 다른 쪽에서도 똑같이 움직이는 미러링 기능

1. 클라이언트에서 현재 Snake의 x, y좌표값을 서버로 전송
2. 서버에서 좌표값을 받아 모든 클라이언트에 전송
3. 서버에서 전송받은 값을 현재 Snake의 x, y값에 적용시켜 미러링 구현

```javascript
function sendData() {
  socket.emit('snakeLocation', s); //현재 Snake의 위치값 전송
}

socket.on('snakeLocation', (snakeData) => {
    s.x = snakeData.x;
    s.y = snakeData.y;
    s.tail = snakeData.tail;
}); //메인클라이언트의 Snake값을 현재 Snake에 적용
//클라이언트
```

```javascript
socket.on('snakeLocation', (data) => {
    io.emit('snakeLocation', data);
});//서버
```

Tip) s = snakeData로 구현할 수 있으면 이상적이나, 배열안에 Structure를 담아서 보낼 때 Structure안에 배열이 있으면 전송이 안됨.

___

## 5단계

___

모든 클라이언트의 먹이의 위치를 같게 하는 기능

1. 클라이언트에서 현재 Food Structure를 서버로 전송
2. 서버에서 받아서 모든 클라이언트에 전송
3. 서버에서 전송받은 값을 현재 Food에 적용시킴

```javascript
function pickLocation() {
    ...

    socket.emit('foodLocation', food);
}
...
socket.on('foodLocation', (foodData) => {
  food = foodData;
}); //클라이언트
```

```javascript
socket.on('foodLocation', (dataFood) => {
    io.emit('foodLocation', dataFood);
}); //서버
```

___

## 6단계

___

한쪽에서만 미러링이 작동하는 것을 고치는 단계.

x, y좌표값은 넘어갔으나 key의 정보를 바탕으로 하는 xspeed, yspeed는 다른 클라이언트의

스네이크가 알 수 없기 때문에 keyEvent를 소켓을 통해 실시간 통신으로 구현하였다.

또한 데이터를 전송하기에 용이하도록 기존의 각각의 변수에 주어졌던 key값을 Structure로 구현하였다.

```javascript
var key = {l: 0, r:0, u:0, d:0};

function update(){
  if(key.l) {s.dir(-1, 0);}
  if(key.r) {s.dir(1, 0);}
  if(key.u) {s.dir(0, -1);}
  if(key.d) {s.dir(0, 1);}
}

function set_key() {

    if (event.keyCode === 37) { key.l = 1; }
    if (event.keyCode === 39) { key.r = 1; }
    if (event.keyCode === 38) { key.u = 1; }
    if (event.keyCode === 40) { key.d = 1; }

    socket.emit('keyEvent', key);
}

socket.on('keyEvent', (keyData) => {
  key = keyData;
}); //클라이언트
```

```javascript
socket.on('keyEvent', (dataKey) => {
    io.emit('keyEvent', dataKey);
}); //서버
```

___

## 7단계

___

소켓 아이디를 생성자 함수에 담아 클라이언트에서 객체를 생성하면 서버로 객체 정보와 소켓 아이디가 함께 넘어가도록 설정

```javascript
function Snake(){
  this.id = socket.id; //현 클라이언트의 소켓 아이디를 담음
  ...
}//클라이언트
```

___

## 8단계

소켓 아이디를 포함한 객체 정보를 받아와서 다음과 같은 로직 실행

1. 배열을 하나 선언
2. 배열이 비어있다면 클라이언트의 객체값 삽입
3. 배열이 비어있지 않다면 배열의 id값과 클라이언트 객체의 id값을 검사해서
4. 같으면 덮어씌우고 다르면 후단에 삽입한다.
5. disconnect 이벤트가 발생하면, disconnect된 player의 id값을 검사해 배열에서 제거한다.

```javascript
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
	
socket.on('disconnect', () => {
    console.log('disconnected');
    players.forEach((element) => {
      if(element.id === socket.id){
        var index = players.indexOf(element);
        players.splice(index, 1);
      }
    });
}); //서버
```

___

## 9단계

___

서버에서 받아온 데이터로 멀티플레이를 구현하였다.

변경점은 다음과 같다.

```javascript
socket.on('snakeLocation', (snakeData) => {
  snakeDana.foreach((snakeElement) => {
    if(snakeElement.id === socket.id){
      var index = snakeData.indexOf(snakeElement);
      snakeData.splice(index, 1);
      for(var j in snakeData){
        ctx.fillStyle = "blue";
        ctx.fillRect(snakeData[j].x, snakeData[j].y, scl, scl);
        ctx.fillStyle = "black";
      }
    }
  });
});

//key이벤트 삭제
```

로직을 살펴보자.

1. 접속된 클라이언트들의 Snake정보가 넘어온다
2. 배열하나하나마다의 아이디와 현재 클라이언트의 아이디가 같은지 검사한다
3. 같다면 배열에서 자신의 클라이언트 정보가 담긴 Snake정보를 삭제한다(이미 s로 그려지고 있으므로)
4. 이후 나머지 클라이언트의 snake를 파란색으로 그린다

Tips) 괜찮은 로직이라고 생각했지만 치명적인 단점이 있었다. 캔버스를 이용할 때, draw, update는 따로 작성해야 충돌하지 않는다는 점이었다.

___

## 10단계

___

9단계에서 서술했듯, Update부분에서 Draw를 하니 멀티플레이는 실행이 되었으나, 다른 클라이언트의 색이 검정색과 파란색으로 점등하는 것을 알 수 있다.

또한, head부분만을 작성하였는데 tail을 그릴것을 Update부분에서 그리게 되면 위에있는 draw를 한 번 더 작성하는 것이 된다.

따라서, 생성자 함수 안에 있던 draw함수를 빼내어 자신의 Snake뿐만 아니라 다른 클라이언트의 Snake를 그릴 때도 사용하게 하였다.

```javascript
var arrSnake = []; //서버에서 받아온 배열을 socket.on밖에서 사용할 수 있도록 복사할 배열 생성

//생성자 함수의 this.draw삭제

function drawSnake(si) {
  var i;
  if(si.id === s.id){
    ctx.fillStyle = "gray";
  }else{
    ctx.fillStyle = "skyblue";
  }
  for(i = 0; i < si.tail.length - 1; i += 1){
    ctx.fillRect(si.tail[i].x, si.tail[i].y, scl, scl);
  }
  //tail 그리는 로직. 자신의 꼬리는 gray로, 다른 클라이언트의 꼬리는 skyblue로 그려준다.
  if(si.id === s.id){
    ctx.fillStyle = "black";
  }else{
    ctx.fillStyle = "blue";
  }
  ctx.fillRect(si.x, si.y, scl, scl);
  //head 그리는 로직. 자신의 head는 black으로, 다른 클라이언트의 head는 blue로 그려준다.
}

function gameLoop(){
  var i = 0;
  ...
  for(i; i < arrSnake.length; i++){
    drawSnake(arrSnake[i]);
  }
}

socket.on('snakeLocation', (arrServer) => {
  arrSnake = arrServer;
});
```

___

## 11단계

___

key이벤트를 touch이벤트로 바꾸어서 모바일 환경에서 사용할 수 있도록 하였다.

변경된 점은 다음과 같다.

```javascript
function set_key(evt){ //evt는 터치이벤트가 발생했을 때의 정보다.
  key.l = key.r = key.u = key.d = 0;
  var clientX = evt.touches[0].clientX;
  var clientY = evt.touches[0].clientY;
  
  if(clientX < 100){key.l = 1;}
  if(clientX > 500){key.r = 1;}
  if(clientX > 100 && clientX < 500 && clientY < 300){key.u = 1;}
  if(clientX > 100 && clientX < 500 && clientY > 300){key.d = 1;}
}

document.ontouchstart = set_key;
```



 











