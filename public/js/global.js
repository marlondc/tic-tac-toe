var socket = io();

function User() {
  this.name;
}

var user = new User;

socket.on('connect', function(data) {
  var user_name = prompt("Who dis?");
  user_name === null
    ? user.name = 'Anonymous'
    : user.name = user_name;
  socket.emit('join', 'Hello World from ' + user.name);
});

socket.on('broad', function(data) {
  if (data.message.match(/\/blue/)) {
    $('<p style=\'background: blue; height: 30px; width: 30px;\'></p>').appendTo('#future');
  } else {
    $('<p>' + data.name + ': ' + data.message + '</p>').appendTo('#future');
  }
});

$('form').submit(function(e){
  e.preventDefault();
  var message = $('#chat_input').val();
  $('#chat_input').val('');
  socket.emit('messages', {name: user.name,
                           message: message});
});
