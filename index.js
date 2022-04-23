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

//console.log(mongoose);
mongoose
	.connect(URI)
	.then(() => {
		console.log('Connected to MongoDB!');
	})
	.catch((err) => {
		console.log(err);
	});

// const UserSchema = new mongoose.Schema({
// 	username: { type: String },
// 	password: { type: String }
// });

//const User = mongoose.model('User', UserSchema);
// User.create(
// 	{
// 		username: '1',
// 		password: '2'
// 	},
// 	(err, user) => {
// 		console.log(err ? err : user);
// 	}
// );

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
	if (users.length > 0) {
		map1.set(socket.id, users[users.length - 1]);
	}
	hiUser = users[users.length - 1];
	socket.emit('hi', hiUser);
	console.log('after this');
	console.log(map1);

	socket.emit('online', users);
	socket.on('hello', (name, pass) => {
		const u = new User({
			username: name,
			password: pass
		});
		u.save().then(() => {
			console.log('yeah, new user saved!');
			//window.alert('success!');
		});
	});
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
	// socket.on('leave', (user) => {
	// 	console.log("left");
	// 	//Broadcast the message to everyone
	// });
});

http.listen(port, () => {
	console.log(`Express app listening at http://localhost:${port}`);
});
