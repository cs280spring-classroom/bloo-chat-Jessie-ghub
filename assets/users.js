document.addEventListener('DOMContentLoaded', (_event) => {
	// Connect to socket.io
	const socket = io(); // automatically tries to connect on same port app was served from
	const submitBtn = document.getElementById('submit');
	const name = document.getElementById('newName').value;
	const pass = document.getElementById('newPass').value;

	submitBtn.addEventListener('click', (event) => {
		const name = document.getElementById('newName').value;
		const pass = document.getElementById('newPass').value;
		if (name != '' && pass != '') {
			socket.emit('hello', name, pass);
			window.alert('success!');
		} else {
			window.alert('invalid input!');
		}
		event.preventDefault();
	});
});

// const submitBtn = document.getElementById('submit');
// submitBtn.addEventListener('click', handleFormSubmit);
// const User = require('../models/User');
// const express = require('express');
// const app = express();
// const http = require('http').Server(app);
// const io = require('socket.io')(http);
// const socket = io();

// function handleFormSubmit(event) {
// 	//socket.emit('hello', "make it");
// 	event.preventDefault();
// 	socket.emit('hello', "make it");
// 	console.log('here!');

// 	const name = document.getElementById('newName').value;
// 	const pass = document.getElementById('newPass').value;
// 	if (name != '' && pass != '') {
// 		//u.save().then(()=>{
// const u = new User({
// 	username: '522',
// 	password: '511'
// });
// u.save().then(() => {
// 	console.log('yeah, new user saved!');
// 	//window.alert('success!');
// });
// 		console.log('yeah, new user saved!');
// 		window.alert('success!');
// 		//});
// 		// const user = await User.create({  username:name, password: pass},(err, user) => {
// 		//             console.log(err ? err : user);
// 		//          });
// 		// User.create(
// 		//     {
// 		//         username: name,
// 		//         password: pass
// 		//     },
// 		//     (err, user) => {
// 		//         console.log(err ? err : user);
// 		//     }
// 		// );

// 		return;
// 	} else {
// 		window.alert('invalid input!');
// 	}
// }
