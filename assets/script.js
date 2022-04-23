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
		message.innerHTML = `<strong>${msg.user}</strong>: ${msg.message}`;
		messages.appendChild(message);
		messages.scrollTop = messages.scrollHeight;
	});

	socket.on('hi', (name) => {
		const message = document.createElement('li');
		message.innerHTML = `Hi ${name}! Welcome to the BLOO CHAT!`;
		messages.appendChild(message);
	});

	socket.on('leave', (name) => {
		const message = document.createElement('li');
		message.innerHTML = `${name} left the chat`;
		messages.appendChild(message);
	});

	socket.on('online', (users) => {
		const message = document.createElement('li');
		if (users.length === 1) {
			message.innerHTML = `no users rn`;
		} else {
			pps = '';
			for (i = 0; i < users.length - 1; i++) {
				pps += users[i];
				if (i != users.length - 2 && i >= 0) {
					pps += ', ';
				}
			}
			message.innerHTML = `${pps} in room`;
		}
		messages.appendChild(message);
	});

	socket.on('new', (name) => {
		const message = document.createElement('li');
		message.innerHTML = `<strong>${name}</strong> entered group chat`;
		messages.appendChild(message);
	});
});
