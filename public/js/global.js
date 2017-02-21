var socket = io.connect('http://localhost:4200');

function User() {
  this.name;
}

var user = new User;

socket.on('connect', function(data) {
  var user_name = prompt("Who dis?");
  user_name.length === 0
    ? user.name = 'Anonymous'
    : user.name = user_name;
  $('<p>' + user_name + ' has entered the chat!</p>').appendTo('#future');
  socket.emit('join', 'Hello World from ' + user.name);
});

socket.on('broad', function(data) {
  $('<p>' + data.name + ': ' + data.message + '</p>').appendTo('#future');
});

$('form').submit(function(e){
  e.preventDefault();
  var message = $('#chat_input').val();
  $('#chat_input').val('');
  if (message.length !== 0) {
    socket.emit('messages', {name: user.name,
                            message: message});
  }
});
