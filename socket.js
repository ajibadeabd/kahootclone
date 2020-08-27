

var express = require('express');
var router = express.Router();
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
// var Chat = require('../models/Chat.js');

// Socket IO
server.listen(4000);

io.on('connection', function (socket) {
  console.log(`User connected ...${socket.id}`);
  socket.on('disconnect', function() {
    console.log(`User disconnected ${socket.id}`);
  });
  socket.on('joined', function (data) {
    console.log(data);
    // io.emit('new-message', { message: data });
    socket.broadcast.emit('display', { message: data });

  });
});



// var express = require('express');
// var router = express.Router();
// var app = express();
// var server = require('http').createServer(app);
// var io = require('socket.io')(server);
// // var Chat = require('../models/Chat.js');

// // Socket IO
// server.listen(4000);

// io.on('connection', function (socket) {
//   console.log(`User connected ...${socket.id}`);
//   socket.on('disconnect', function() {
//     console.log(`User disconnected ${socket.id}`);
//   });
//   socket.on('save-message', function (data) {
//     console.log(data);
//     // io.emit('new-message', { message: data });
//     socket.broadcast('new-message', { message: data });
//   });
  
// });
// module.exports=io
