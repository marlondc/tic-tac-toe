var socket = io();

const targetColour = '#ff7458';
const currentColour = '#00878e';
const defaultColour ='#eee';
const successColour = '#2670b3';

const directionValues = {
  0: 'right',
  1: 'left',
  2: 'up',
  3: 'down'
};

function User() {
};

const user = new User();

socket.on('connect', function(data) {
  var user_name = prompt("Who dis?");
  user_name === null
    ? user_name = 'Anonymous'
    : user_name = user_name;
  socket.emit('joinConvo', user_name);
});

socket.on('setup game for user', function(data) {
  setUpGame(data);
});

socket.on('users in room', function(data) {
  $('<p>' + data.user.user_name + ' has ' + data.user.control + ' controls</p>').appendTo('#info');
})

socket.on('move', function(data) {
  resetCell();
  user.game = data;
  colourInCells();
})

socket.on('end game', function(data) {
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

function setUserData(userData) {
  user.name = userData.user.name;
  user.socketID = userData.user.socketID;
  user.control = userData.user.control;
  user.room = userData.room;
  user.game = userData.game;
}

function resetCell(){
  $('#cell-' + user.game.currentPosition).css({'background': defaultColour});
  $('#cell-' + user.game.target).css({'background': defaultColour});
};

function setUpGame(data) {
  setUserData(data);
  removeAppropriateControls();
  colourInCells();
}

function colourInCells() {
  $('#cell-' + user.game.target).css({'background': targetColour});
  $('#cell-' + user.game.currentPosition).css({'background': currentColour});
}

function removeAppropriateControls() {
  if (user.control === 'vertical') {
    $('#right_click').hide();
    $('#left_click').hide();
  } else if (user.control === 'horizontal') {
    $('#up_click').hide();
    $('#down_click').hide();
  } else if (user.control === 'watcher') {
    $('#right_click').hide();
    $('#left_click').hide();
    $('#up_click').hide();
    $('#down_click').hide();
  }
}
