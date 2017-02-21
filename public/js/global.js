var socket = io.connect('http://localhost:4200');

socket.on('connect', function(data) {
  var name = prompt("Who dis?");
  socket.emit('join', 'Hello World from ' + name);
});

socket.on('broad', function(data) {
  $('<p>' + data.name + ': ' + data.message + '</p>').appendTo('#future');
});

$('form').submit(function(e){
  e.preventDefault();
  var message = $('#chat_input').val();
  $('#chat_input').val('');
  socket.emit('messages', {name: name,
                           text: message});
});
