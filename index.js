const debug = require('debug')('bloo-chat');
const nunjucks = require('nunjucks');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 7000;
users = [];
nunjucks.configure('views', {
	autoescape: true,
	express: app
});
const map1 = new Map();
app.use(express.static('assets'));

app.get('/', (req, res) => {
	res.render('index.njk', null);
});

app.get('/chatroom', (req, res) => {
//	console.log(users);
	res.render('chatroom.njk', { uname: req.query.uname });
	io.emit('new', req.query.uname);
	users.push(req.query.uname);
 // console.log(users);
});

io.on('connection', function(socket) {
	socket.emit('hi', 'Hi! Welcome to the BLOO CHAT!');
  //console.log(users);

  socket.emit('online', users);
	socket.on('message', (msg) => {
		debug(`${msg.user}: ${msg.message}`);
		//Broadcast the message to everyone
		io.emit('message', msg);
	});
	socket.on('disconnect', function() {
		console.log("left");
	});
  // socket.on('leave', (user) => {
	// 	console.log("left");
	// 	//Broadcast the message to everyone
	// });
  
});

http.listen(port, () => {
	console.log(`Express app listening at http://localhost:${port}`);
});
