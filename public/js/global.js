var socket = io();

function User() {
  this.name;
}

const direction = {
  0: 'right',
  1: 'left'
};

var user = new User;

const greeting = 'Hello people!'

socket.on('connect', function(data) {
  // var user_name = prompt("Who dis?");
  // user_name === null || user_name === ''
  //   ? user.name = 'Anonymous'
  //   : user.name = user_name;
  user.name = 'Anonymous';
  socket.emit('messages', {name: user.name,
                           message: greeting});
  socket.emit('join', 'Hello World from ' + user.name);
});

socket.on('broad', function(data) {
  if (data.message.match(/\/blue/)) {
    $('<p style=\'background: blue; height: 30px; width: 30px;\'></p>').appendTo('#future');
  } else {
    $('<p>' + data.name + ': ' + data.message + '</p>').appendTo('#future');
  }
});

socket.on('move', function(data) {
  console.log(data);
})

$('form').submit(function(e){
  e.preventDefault();
  var message = $('#chat_input').val();
  $('#chat_input').val('');
  if (message.length !== 0) {
    socket.emit('messages', {name: user.name,
                            message: message});
  }
});

function press(value) {
  socket.emit('direct', direction[value]);
}
