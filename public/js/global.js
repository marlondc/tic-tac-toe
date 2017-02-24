var socket = io();

function User() {
  this.name;
  this.room;
}

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
  user.name = 'Anonymous';
  socket.emit('joinConvo', user.name);
});

socket.on('designatedRoom', function(data) {
  console.log(data);
  user.room = data.room;
  user.control = data.control;
  updateCount(data.pointer);
});


socket.on('move', function(data) {
 updateCount(data.pointer);
})


function press(value) {
  socket.emit('direct', {room: user.room,
                         direction: directionValues[value]});
}

function updateCount(object) {
  $('#left_count').text(object.left);
  $('#right_count').text(object.right);
}

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
