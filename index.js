const debug = require('debug')('bloo-chat');
const nunjucks = require('nunjucks');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const User = require('./models/User');
const mongoose = require('mongoose');
const URI = `mongodb+srv://jessie:Jessie2002@boolchat.jb9fv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
count = 0;
var alert = require('alert');
const bcrypt = require('bcrypt');
const { hashPassword } = require('./util/hashing');
const { verifyPassword } = require('./util/hashing');
nunjucks.configure('views', { autoescape: true });

mongoose
	.connect(URI)
	.then(() => {
		console.log('Connected to MongoDB!');
	})
	.catch((err) => {
		console.log(err);
	});

const port = process.env.PORT || 7000;
users = [];
nunjucks.configure('views', {
	autoescape: true,
	express: app
});
const map1 = new Map();
app.use(express.static('assets'));

app.get('/', (req, res) => {
	console.log(users);
	res.render('index.njk', null);
});

app.get('/register', (req, res) => {
	n = req.query.newName;
	pwd = req.query.newPass;
	if (n != '' && pwd != '') {
		hashPassword(pwd)
			.then((result) => {
				console.log(result);
				const u = new User({
					username: n,
					password: result
				});
				u.save().then(() => {
					alert('Account created! chat now');
				});
			})
			.catch((err) => {
				console.log(err);
			});
		//socket.emit('add user', name.value, pass.value);
	} else {
		alert('invalid input');
	}
});

app.get('/chatroom', (req, res) => {
	username = req.query.uname;
	password = req.query.password;
	if (username == '' || password == '') {
		alert('You must provide both username and password.');
	} else {
		User.findOne({ username }).then((user) => {
			verifyPassword(password, user ? user.password : '')
				.then((result) => {
					if (result) {
						// if (users.indexOf(username) < 0) {
						// 	users.push(username);
						// }
						res.render('chatroom.njk', { uname: username });
						// io.emit('new', username);
						console.log('authorization succeed');
					} else {
						alert('authorization failed');
					}
				})
				.catch((err) => {
					console.log(err);
				});
		});
	}
});

io.on('connection', function(socket) {
	// if (users.length > 0 && users.length > count) {
	// 	map1.set(socket.id, users[users.length - 1]);
	// 	count = count + 1;
	// }
	// hiUser = map1.get(socket.id);
	// socket.emit('hi', hiUser);
	// console.log('after this');
	// console.log(socket.id);
	// console.log(map1);
	// console.log(users);
	socket.on("uname", username => {
		users.push(username);
		map1.set(socket.id,username);
		//user[socket.id] = username;
		socket.emit('online', users);
		socket.broadcast.emit('new',username);
	});
	
	socket.on('message', (msg) => {
		debug(`${msg.user}: ${msg.message}`);
		//Broadcast the message to everyone
		io.emit('message', msg);
	});
	socket.on('disconnect', function() {
		nameRemove = map1.get(socket.id);
		// console.log(nameRemove);
		socket.broadcast.emit('leave', nameRemove);
		// console.log('left');
		index = users.indexOf(nameRemove);
		if (index > -1) {
			users.splice(index, 1);
		}
		map1.delete(socket.id);
	});
});

http.listen(port, () => {
	console.log(`Express app listening at http://localhost:${port}`);
});
