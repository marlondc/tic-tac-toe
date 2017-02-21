var socket = io.connect('http://localhost:4200');

socket.on('connect', function(data) {
  socket.emit('join', 'Hello World from client');
});

socket.on('broad', function(data) {
  $('#future').html(data);
});

$('form').submit(function(e){
  e.preventDefault();
  var message = $('#chat_input').val();
  socket.emit('messages', message);
});
