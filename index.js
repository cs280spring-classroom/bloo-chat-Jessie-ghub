const debug = require('debug')('bloo-chat');
const nunjucks = require('nunjucks');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const faker = require('faker');
const User = require('./models/User');
const mongoose = require('mongoose');
const URI = `mongodb+srv://jessie:Jessie2002@boolchat.jb9fv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
count = 0;
var alert = require('alert');
const bcrypt = require('bcrypt');
const { hashPassword } = require('./assets/hashing');
const { verifyPassword } = require('./assets/hashing');

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
						users.push(username);
						res.render('chatroom.njk', { uname: username });
						io.emit('new', username);
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
	if (users.length > 0 && users.length > count) {
		map1.set(socket.id, users[users.length - 1]);
		count = count + 1;
	}
	hiUser = users[users.length - 1];
	socket.emit('hi', hiUser);
	console.log('after this');
	console.log(map1);
	console.log(users);

	socket.emit('online', users, hiUser);
	socket.on('message', (msg) => {
		debug(`${msg.user}: ${msg.message}`);
		//Broadcast the message to everyone
		io.emit('message', msg);
	});
	socket.on('disconnect', function() {
		name = map1.get(socket.id);
		console.log(name);
		io.emit('leave', name);
		console.log('left');
		index = users.indexOf(name);
		if (index > -1) {
			users.splice(index, 1);
		}
	});
});

http.listen(port, () => {
	console.log(`Express app listening at http://localhost:${port}`);
});
