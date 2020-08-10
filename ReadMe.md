# MultiSnakeGame

___

- 1단계 - Express를 통해서 정적파일 제공
- 2단계 - 소켓 연결
- 3단계 - emit이벤트로 콘솔출력해보기, 소켓 아이디 출력
- 4단계 - 소켓으로 한쪽 미러링 구현(x, y좌표 쏴주고 클라이언트에서 해당 좌표를 모든 연결된 소켓객체에 연결)
- 5단계 - 먹이 위치 미러링 구현 - 먹이의 위치값만
- 6단계 - 양쪽 미러링 구현(keyEvent를 소켓으로 구현)
- 7단계 - 소켓 아이디 클라이언트 전송, 클라이언트에서 접속된 모든 소켓아이디 출력
- 8단계 - 플레이어의 head만을 대상으로 한 멀티플레이 구현 - 미완

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

function callData() {
  socket.on('snakeLocation', (data) => {
    s.x = data.x;
    s.y = data.y;
  });
} //받아온 위치값을 현재 Snake에 적용
//클라이언트
```

```javascript
socket.on('snakeLocation', (data) => {
    io.emit('snakeLocation', data);
});//서버
```

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
socket.on('foodLocation', (data) => {
  food = data;
}); //클라이언트
```

```javascript
socket.on('foodLocation', (data) => {
    io.emit('foodLocation', data);
}); //서버
```

___

## 6단계

___

한쪽에서만 미러링이 작동하는 것을 고치는 단계.

x, y좌표값은 넘어갔으나 key의 정보를 바탕으로 하는 xspeed, yspeed는 다른 클라이언트의

스네이크가 알 수 없기 때문에 keyEvent를 소켓을 통해 실시간 통신으로 구현하였다.

```javascript
var key = {l: 0, r:0, u:0, d:0};
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
    io.emit('snakeLocation', players);
  }); //서버
```











