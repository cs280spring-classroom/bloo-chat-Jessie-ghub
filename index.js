require('dotenv').config();
const debug = require('debug')('bloo-chat');
const nunjucks = require('nunjucks');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const User = require('./models/User');
const mongoose = require('mongoose');
const URI = process.env.URI;
count = 0;
var alert = require('alert');
const { hashPassword } = require('./util/hashing');
const { verifyPassword } = require('./util/hashing');
nunjucks.configure('views', { autoescape: true });
const port = process.env.PORT || 7000;
app.use(express.static('assets'));

mongoose
	.connect(URI)
	.then(() => {
		console.log('Connected to MongoDB!');
	})
	.catch((err) => {
		console.log(err);
	});

nunjucks.configure('views', {
	autoescape: true,
	express: app
});

// store usernames
users = [];
// store socket.id and corresponding usernames
const userMap = new Map();

app.get('/', (req, res) => {
	console.log(users);
	res.render('index.njk', null);
});

app.get('/register', async (req, res) => {
	account_name = req.query.newName;
	account_pwd = req.query.newPass;
	// check valid account name and password
	if (account_name != '' && account_pwd != '') {
		result = await hashPassword(account_pwd);
		//.then((result) => {
		const account = new User({
			username: account_name,
			password: result
		});
		// add new account to the db
		await account.save();
		alert('Account created! chat now');
		//})
		// .catch((err) => {
		// 	console.log(err);
		// });
		// hashPassword(account_pwd)
		// 	.then((result) => {
		// 		const account = new User({
		// 			username: account_name,
		// 			password: result
		// 		});
		// 		// add new account to the db
		// 		account.save().then(() => {
		// 			alert('Account created! chat now');
		// 		});
		// 	})
		// 	.catch((err) => {
		// 		console.log(err);
		// 	});
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
		// check whether the username and password is in the database
		result = await User.findOne({ username })
			.then((user) => {
				verifyPassword(password, user ? user.password : '')
					.then((result) => {
						if (result) {
							// success, go to chatroom
							res.render('chatroom.njk', { uname: username });
							console.log('authorization succeed');
						} else {
							alert('authorization failed');
						}
					})
					.catch((err) => {
						console.log(err);
					});
			})
			.catch((err) => {
				console.log(err);
				alert('user not found');
			});
	}
});

io.on('connection', function(socket) {
	socket.on('log in', (username) => {
		// update local variables
		users.push(username);
		userMap.set(socket.id, username);
		// for the new user, display online users; for others, notify new user entrance
		socket.emit('online', users);
		socket.broadcast.emit('enter chat', username);
	});

	socket.on('message', (msg) => {
		debug(`${msg.user}: ${msg.message}`);
		//Broadcast the message to everyone
		io.emit('message', msg);
	});

	socket.on('disconnect', function() {
		nameRemove = userMap.get(socket.id);
		// notify everyone else who left
		socket.broadcast.emit('leave chat', nameRemove);
		// update local variables
		index = users.indexOf(nameRemove);
		if (index > -1) {
			users.splice(index, 1);
		}
		userMap.delete(socket.id);
	});
});

http.listen(port, () => {
	console.log(`Express app listening at http://localhost:${port}`);
});
