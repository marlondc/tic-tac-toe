var express = require('express');
var app= express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));

app.get('/', function(req, res, next) {
  res.sendFile(__dirname + '/index.html');
});

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
      room: chatRoom
    };
    client.emit('designatedRoom', data);
  });

  client.on('messages', function(data) {
    io.in(data.room).emit('broad', data);
  });

  client.on('direct', function(data) {
    client.emit('move', data);
    client.broadcast.emit('move', data);
  })
});

server.listen(process.env.PORT || 4200, function() {
  console.log('app listening on port %d ', + this.address().port);
});
