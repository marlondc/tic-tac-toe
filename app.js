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
  this.player1;
  this.player2;
};

function User() {
}

const noFurtherRight = [3,7,11,15];
const noFurtherLeft = [0,4,8,12];


function getCoordinates() {
  let a = Math.floor(Math.random() * 16);
  let b = Math.floor(Math.random() * 16);
  if ( a !== b ) {
    return {target: a, start: b};
  } else {
    getCoordinates();
  }
}

function setUpGameBackend() {
  let coordinates = getCoordinates();
  return new Game(coordinates.target, coordinates.start);
};

let game = setUpGameBackend();
let user = new User;

let defaultRoom = 'general';
let rooms = ['room1', 'room2', 'room3'];
let generalCount = 0;

io.on('connection', function(client) {

  client.emit('setup', {
    rooms: rooms
  });

  client.on('joinConvo', function(data) {
    let chatRoom = 'room1';
    let playerControls;
    if (generalCount === 0) {
      chatRoom = 'general';
      user.control = 'horizontal';
    } else if (generalCount === 1) {
      chatRoom = 'general';
      user.control = 'vertical';
    }

    client.join(chatRoom);
    user.name = 'Player' + generalCount;
    user.socketID = client.id;
    if (chatRoom === 'general') {
      generalCount += 1;
    }
    data = {
      user: user,
      message : user.name + ' is in ' + chatRoom,
      room: chatRoom,
      game: game
    };
    io.in(client.id).emit('user joined', data);
  });

  client.on('direct', function(data) {
    switch(data.direction) {
      case 'right':
        if(noFurtherRight.indexOf(game.currentPosition) === -1) {
          game.currentPosition += 1;
        }
        break;
      case 'left':
        if(noFurtherLeft.indexOf(game.currentPosition) === -1) {
          game.currentPosition -= 1;
        }
        break;
      case 'up':
        if(game.currentPosition >= 4) {
          game.currentPosition -= 4;
        }
        break;
      case 'down':
        if(game.currentPosition <= 11) {
          game.currentPosition += 4;
        }
        break;
    }
    io.in(data.room).emit('move', game);
  })

  client.on('disconnect', function() {
    console.log(user.name + ' with id: ' + user.socketID + ' has disconnected');
  })
});


server.listen(process.env.PORT || 4200, function() {
  console.log('app listening on port %d ', + this.address().port);
});
