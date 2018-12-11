
var socket = io();

$("button").on('click', function() {
  var text = $("#message").val(); // add message
  var who = $("#initials").val(); // add initials
  // var time = new Date().toLocaleString();
  
  socket.emit('message', who + ": " + text);
  $('#message').val('');
  
  return false;
});

socket.on('message', function (msg) {
  $('<li>').text(msg).css({color: 'green'}).appendTo('#history'); //creates new chat
});
