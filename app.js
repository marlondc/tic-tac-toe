var express = require('express');
var app= express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));

app.get('/', function(req, res, next) {
  res.sendFile(__dirname + '/index.html');
});


function Pointer() {
  this.left = 0;
  this.right = 0;
}

let pointer = new Pointer;

io.on('connection', function(client) {
  var defaultRoom = 'general';
  var rooms = ['room1', 'room2', 'room3'];

  client.emit('setup', {
    rooms: rooms
  });

  client.on('joinConvo', function(data) {
    let user_name = data;
    let generalRoom = io.sockets.adapter.rooms['general'];
    let chatRoom = 'room1';
    if (generalRoom === undefined || generalRoom.length < 2) {
      chatRoom = 'general';
    }

    client.join(chatRoom);
    io.in(chatRoom).emit('user joined', data);
    data = {
      name: user_name,
      message : user_name + ' is in ' + chatRoom,
      room: chatRoom,
      pointer: pointer
    };
    client.emit('designatedRoom', data);
  });

  client.on('messages', function(data) {
    io.in(data.room).emit('broad', data);
  });

  client.on('direct', function(data) {
    if (data.direction === 'right') {
      pointer.right += 1;
    } else {
      pointer.left += 1;
    }
    io.in(data.room).emit('move', {pointer: pointer});
  })
});

server.listen(process.env.PORT || 4200, function() {
  console.log('app listening on port %d ', + this.address().port);
});
