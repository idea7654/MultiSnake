var express = require('express');
var app = express();

app.use(express.static('public01'));
var server = app.listen(3000);
console.log('server is connected');
