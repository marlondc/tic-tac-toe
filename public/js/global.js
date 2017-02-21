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
  socket.emit('join', 'Hello World from ' + name);
});

socket.on('broad', function(data) {
  $('<p>' + data.name + ': ' + data.message + '</p>').appendTo('#future');
});

$('form').submit(function(e){
  e.preventDefault();
  var message = $('#chat_input').val();
  $('#chat_input').val('');
  socket.emit('messages', {name: user.name,
                           message: message});
});
