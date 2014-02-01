
/**
 * Module dependencies.
 */

 var express = require('express');
 var routes = require('./routes');
 var user = require('./routes/user');
 var http = require('http');
 var path = require('path');
 var util = require('./util/functions');

 var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/r/:id', routes.room);

var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});


var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket){
	var userid = socket.id;

	socket.emit('ready');

	socket.emit('rooms', io.sockets.manager.rooms );

	socket.on('join', function(room) {		
		socket.join(room);

		socket.broadcast.emit('new room', room);
	});

	socket.on('change name', function(data) {
		var nome = data.nome;
		var room = data.room;
		var time = util.getCurrentTime();

		socket.set('username', nome, function(){
			socket.in(room).emit('name changed', {nome: nome, time: time});
			socket.broadcast.to(room).emit('user changed name', {userid: userid, nome: nome, time: time});
		});
	});

	socket.on('send message', function(data) {
		var message = data.message;
		var time = util.getCurrentTime();
		var room = data.room;
		var nome = '';
		socket.get('username', function(err,username) {			
			nome = username ? username : userid;

			socket.in(room).emit('message sent', {message: message, time: time});
			socket.broadcast.to(room).emit('message sent by user', {message: message, name: nome, time: time});
		});
	});

	socket.on('disconnect', function() {
     // this returns a list of all rooms this user is in
     var rooms = io.sockets.manager.roomClients[socket.id];
     
     // Sai de todas as salas que esta conectado
     for(var room in rooms) {
     	socket.leave(room);

     	socket.get('username', function(err,username) {			
     		if(username){
     			socket.broadcast.to(room).emit('user leave room', {name: username});	
     		}
     	});         
     }
     setTimeout(function(){
     	socket.broadcast.emit('rooms', io.sockets.manager.rooms );
     }, 1000);
   });

});

