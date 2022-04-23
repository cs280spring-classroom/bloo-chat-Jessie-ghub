document.addEventListener('DOMContentLoaded', (_event) => {
	// Connect to socket.io
	const socket = io(); // automatically tries to connect on same port app was served from
	const username = document.getElementById('uname').innerText;
	const form = document.getElementById('chatForm');
	const messages = document.getElementById('messages');
	const messageToSend = document.getElementById('txt');

	form.addEventListener('submit', (event) => {
		socket.emit('message', {
			user: username,
			message: messageToSend.value
		});
		messageToSend.value = '';
		event.preventDefault();
	});

	// append the chat text message
	socket.on('message', (msg) => {
		const message = document.createElement('li');
		message.innerHTML = `<strong><u>${msg.user}</u></strong> : ${msg.message}`;
		messages.appendChild(message);
		messages.scrollTop = messages.scrollHeight;
	});

	socket.on('hi', (name) => {
		const message = document.createElement('li');
		message.innerHTML = `<strong><u>BlooChatApp</u></strong>  Welcome ${name}!`;
		messages.appendChild(message);
	});

	socket.on('leave', (name) => {
		if (name) {
			const message = document.createElement('li');
			message.innerHTML = `${name} left the chat`;
			message.style.backgroundColor = 'red';
			messages.appendChild(message);
		}
	});

	socket.on('online', (users, name) => {
		const message = document.createElement('li');
		if (users.length === 1) {
			message.innerHTML = `<strong><u>BlooChatApp</u></strong>  Unfortunately no one is online at the moment`;
		} else {
			pps = '';
			for (i = 0; i < users.length; i++) {
				if (users[i] != name) {
					pps += users[i];
					pps += ' ';
				}
				// if (i != users.length - 2 && i >= 0) {
				// 	pps += ', ';
				// }
			}
			message.innerHTML = `<strong><u>BlooChatApp</u></strong>  Online users: ${pps}`;
		}
		messages.appendChild(message);
	});

	socket.on('new', (name) => {
		const message = document.createElement('li');
		message.innerHTML = `<strong>${name}</strong> entered group chat`;
		message.style.backgroundColor = 'green';
		messages.appendChild(message);
	});
});
