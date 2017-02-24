var socket = io();

function User() {
  this.name;
  this.room;
}

function Counter() {
  this.left = 0;
  this.right = 0
}

const directionValues = {
  0: 'right',
  1: 'left'
};

const user = new User;
const counter = new Counter;

socket.on('connect', function(data) {
  // var user_name = prompt("Who dis?");
  // user_name === null || user_name === ''
  //   ? user.name = 'Anonymous'
  //   : user.name = user_name;
  user.name = 'Anonymous';
  socket.emit('joinConvo', user.name);
});

socket.on('designatedRoom', function(data) {
  user.room = data.room;
});

socket.on('broad', function(data) {
  if (data.message.match(/\/blue/)) {
    $('<p style=\'background: blue; height: 30px; width: 30px;\'></p>').appendTo('#future');
  } else {
    $('<p>' + data.name + ': ' + data.message + '</p>').appendTo('#future');
  }
});

socket.on('move', function(data) {
  data === 'right'
    ? counter.right += 1
    : counter.left += 1;
 updateCount();
})

$('form').submit(function(e){
  e.preventDefault();
  var message = $('#chat_input').val();
  $('#chat_input').val('');
  if (message.length !== 0) {
    socket.emit('messages', {name: user.name,
                             message: message,
                             room: user.room});
  }
});

function press(value) {
  socket.emit('direct', directionValues[value]);
}

function updateCount() {
  $('#left_count').text(counter.left);
  $('#right_count').text(counter.right);
}

updateCount();
