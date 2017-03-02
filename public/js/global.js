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
  var user_name = prompt("What's your name?");
  user_name === null
    ? user_name = 'Anonymous'
    : user_name = user_name;
  socket.emit('joinConvo', user_name);
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
  console.log(data.score.value);
  $('#counter').text(data.score.value);
  resetCell();
  user.game = data;
  colourInCells();
  resetCell();
  user.game = data.newGame;
  colourInCells();
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

function setUpGame(data) {
  setUserData(data);
  removeAppropriateControls();
  colourInCells();
  $('#counter').text(data.score.value);
}

function colourInCells() {
  $('#cell-' + user.game.target).addClass('target');
  $('#cell-' + user.game.currentPosition).addClass('current');
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
