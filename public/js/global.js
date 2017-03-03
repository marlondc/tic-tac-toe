var socket = io();

const directionValues = {
  0: 'right',
  1: 'left',
  2: 'up',
  3: 'down'
};

const keypressCode = {
  'right' : 39,
  'left' : 37,
  'up' : 38,
  'down' : 40,
}

function User() {
};

const user = new User();

socket.on('connect', function(data) {
  socket.emit('joinConvo', 'anonymous');
});

socket.on('setup game for user', function(data) {
  //private message to user
  setUpGame(data);
});

socket.on('users in room', function(data) {
  //message to all users in the room
})

socket.on('move', function(data) {
  resetCell();
  user.game = data;
  colourInCells();
})

socket.on('end game', function(data) {
  $('#counter').text(data.score.value);
  resetCell();
  user.game = data.currentGame;
  colourInOneCell();
  setTimeout(function() {
    resetCell();
    user.game = data.newGame;
    colourInCells();
  }, 2000)
})

function press(value) {
  socket.emit('direct', {room: user.room,
    direction: directionValues[value]});
}

// const setUserDate = (user) => {
//
// }

function setUserData(userData) {
  user.name = userData.user.name;
  user.socketID = userData.user.socketID;
  user.control = userData.user.control;
  user.room = userData.room;
  user.game = userData.game;
}

function resetCell(){
  $('#cell-' + user.game.currentPosition).removeClass('current');
  $('#cell-' + user.game.target).removeClass('target');
};

function colourInCells() {
  $('#cell-' + user.game.target).addClass('target');
  $('#cell-' + user.game.currentPosition).addClass('current');
}

function colourInOneCell() {
  $('#cell-' + user.game.currentPosition).addClass('current');
}

function setUpGame(data) {
  setUserData(data);
  removeAppropriateControls();
  colourInCells();
  $('#counter').text(data.score.value);
}

function removeAppropriateControls() {
  if (user.control === 'vertical') {
    $('#right_click').hide();
    $('#left_click').hide();
  } else if (user.control === 'horizontal') {
    $('#up_click').hide();
    $('#down_click').hide();
  } else {
    $('#right_click').hide();
    $('#left_click').hide();
    $('#up_click').hide();
    $('#down_click').hide();
  }
}

$(document).keydown(function(event) {
  let direction;
  if (user.control === 'horizontal' && (event.keyCode === 37 || event.keyCode === 39)) {
    direction = event.keyCode === keypressCode.left ? 'left' : 'right';
    socket.emit('direct', {room: user.room,
      direction: direction});
  }
  if (user.control === 'vertical' && (event.keyCode === 38 || event.keyCode === 40)) {
    direction = event.keyCode === keypressCode.up ? 'up' : 'down';
    socket.emit('direct', {room: user.room,
      direction: direction});
  }
});
