var express = require('express');
var app= express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));

app.get('/', function(req, res, next) {
  res.sendFile(__dirname + '/index.html');
});

function Game(target, start) {
  this.target = target;
  this.currentPosition = start;
};

function getCordinates() {
  let a = Math.floor(Math.random() * 16);
  let b = Math.floor(Math.random() * 16);
  if ( a !== b ) {
    return {target: a, start: b};
  } else {
    getCordinates();
  }
}

let game = new Game(getCordinates.target, getCordinates.start);

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
    let playerControls;
    if (generalRoom === undefined) {
      chatRoom = 'general';
      playerControls = 'horizontal';
    } else if (generalRoom.length < 2) {
      chatRoom = 'general';
      playerControls = 'vertical';
    }

    client.join(chatRoom);
    io.in(chatRoom).emit('user joined', data);
    data = {
      name: user_name,
      message : user_name + ' is in ' + chatRoom,
      room: chatRoom,
      game: game,
      control: playerControls
    };
    client.emit('designatedRoom', data);
  });

  client.on('direct', function(data) {
    switch(data.direction) {
      case 'right':
        pointer.right += 1;
        break;
      case 'left':
        pointer.left += 1;
        break;
      case 'up':
        console.log('up');
        break;
      case 'down':
        console.log('down');
        break;
    }
    io.in(data.room).emit('move', {pointer: pointer});
  })


  // client.on('messages', function(data) {
  //   io.in(data.room).emit('broad', data);
  // });
});


server.listen(process.env.PORT || 4200, function() {
  console.log('app listening on port %d ', + this.address().port);
});
