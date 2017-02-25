var socket = io();

const targetColour = '#ff7458';
const currentColour = '#00878e';
const defaultColour ='#eee';

const directionValues = {
  0: 'right',
  1: 'left',
  2: 'up',
  3: 'down'
};

function User() {
  this.name;
  this.socketID;
  this.room;
  this.game;
  this.control;
};

const user = new User();

socket.on('connect', function(data) {
  socket.emit('joinConvo', 'connected user');
});

socket.on('user joined', function(data) {
  setUpGame(data);
  $('<p>' + data.message + ' with controls ' + data.user.control + '</p>').appendTo('#info');
});

function setUserData(userData) {
  user.name = userData.user.name;
  user.socketID = userData.user.socketID;
  user.control = userData.user.control;
  user.room = userData.room;
  user.game = userData.game;
}

socket.on('move', function(data) {
  resetCell();
  user.game = data;
  colourInCells();
})


function resetCell(){
  $('#cell-' + user.game.currentPosition).css({'background': defaultColour});
};

function press(value) {
  socket.emit('direct', {room: user.room,
                         direction: directionValues[value]});
}

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
  } else {
    $('#up_click').hide();
    $('#down_click').hide();
  }
}

//peach colour #ff7458
//lagoon blue #00878e

// socket.on('broad', function(data) {
//   if (data.message.match(/\/blue/)) {
//     $('<p style=\'background: blue; height: 30px; width: 30px;\'></p>').appendTo('#future');
//   } else {
//     $('<p>' + data.name + ': ' + data.message + '</p>').appendTo('#future');
//   }
// });


// $('form').submit(function(e){
//   e.preventDefault();
//   var message = $('#chat_input').val();
//   $('#chat_input').val('');
//   if (message.length !== 0) {
//     socket.emit('messages', {name: user.name,
//                              message: message,
//                              room: user.room});
//   }
// });
