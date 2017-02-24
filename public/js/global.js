var socket = io();

function User() {
  this.name;
  this.room;
  this.game;
}

const targetColour = '#ff7458';
const currentColour = '#00878e';
const defaultColour ='#eee';

const directionValues = {
  0: 'right',
  1: 'left',
  2: 'up',
  3: 'down'
};

const user = new User;


socket.on('connect', function(data) {
  // var user_name = prompt("Who dis?");
  // user_name === null || user_name === ''
  //   ? user.name = 'Anonymous'
  //   : user.name = user_name;
  socket.emit('joinConvo', 'player');
});

socket.on('designatedRoom', function(data) {
  setUpGame(data);
});

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
  user.game = data.game
  user.room = data.room;
  user.control = data.control;
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
