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
    return getCoordinates();
  }
}

let users = [];

function setUpGameBackend() {
  let coordinates = getCoordinates();
  return new Game(coordinates.target, coordinates.start);
};

let game = setUpGameBackend();

let defaultRoom = 'general';
let rooms = ['room1', 'room2', 'room3'];
let generalCount = 0

io.on('connection', function(client) {

  client.emit('setup', {
    rooms: rooms
  });

  client.on('joinConvo', function(data) {
    let user = new User;
    let chatRoom = 'general';
    let playerControls;
    if (generalCount % 2 === 0) {
      user.control = 'horizontal';
    } else {
      user.control = 'vertical';
    }
    user.name = 'Player' + (users.length + 1);
    user.user_name = data;
    user.socketID = client.id;
    users.push(user);

    client.join(chatRoom);
    let controls = users.map(function(user) {
      return user.control;
    })
    if(controls.indexOf('vertical') === -1 && controls.length > 1) {
      console.log('No Vertical control');
    }
    if(controls.indexOf('horizontal') === -1 && controls.length > 1) {
      console.log('No horizontal control');
    }
    if (chatRoom === 'general') {
      generalCount += 1;
    }
    data = {
      user: user,
      message : user.user_name + ' is in ' + chatRoom,
      room: chatRoom,
      game: game
    };
    io.in(client.id).emit('setup game for user', data);
    io.in(data.room).emit('users in room', data);
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
    if(game.currentPosition !== game.target) {
      io.in(data.room).emit('move', game);
    } else if (game.currentPosition === game.target) {
      let createNewGame = setUpGameBackend();
      io.in(data.room).emit('end game', {currentGame: game,
                                         newGame: createNewGame
                                         })
      game = createNewGame;
    }
  })

  client.on('disconnect', function(data) {
    users = users.filter(function(user) {
      return user.socketID !== client.id
    })
  })
});


server.listen(process.env.PORT || 4200, function() {
  console.log('app listening on port %d ', + this.address().port);
});
