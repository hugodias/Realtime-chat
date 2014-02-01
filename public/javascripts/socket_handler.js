function mountChatMessage(author, message, time) {
  var source   = $("#message-template").html();
  var template = Handlebars.compile(source);
  var context = {author: author, body: message, time: time}
  var html    = template(context);  
  $('#comments ol').append(html);  
  scrollBottomChat();
}

function mountStatusMessage(message) {
  var source   = $("#status-template").html();
  var template = Handlebars.compile(source);
  var context = {message: message}
  var html    = template(context);  
  $('#comments ol').append(html);  
  scrollBottomChat();
}

function scrollBottomChat() {
  var element = $("#comments")[0];
  element.scrollTop = element.scrollHeight;
}

var socket = io.connect('http://localhost');
var room = window.location.href.split('/')[4];

socket.on('ready', function(){
  socket.emit('join', room);
});

socket.on('room ready', function(data){
  console.log('Joined on room: ' + data.room);
});

// Socket que emitiu
socket.on('name changed', function(data) {
  mountStatusMessage('Bem vindo, <strong>' + data.nome + '</strong>');
  $('.content-chat').show();
  $('.row-alterar-nome').hide();
  $('#mensagem').focus();
});
socket.on('message sent', function(data) {
  mountChatMessage('Me', data.message, data.time);
});

// Broadcast
socket.on('user changed name', function(data) {
  mountStatusMessage('O usuario <strong>' + data.nome + '</strong> entrou no chat');
});
socket.on('message sent by user', function(data) {
  mountChatMessage(data.name, data.message, data.time);
});
socket.on('user leave room', function(data) {
  mountStatusMessage('O usuario <strong>' + data.name + '</strong> saiu da sala.');
})