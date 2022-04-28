document.addEventListener('DOMContentLoaded', (_event) => {
	// Connect to socket.io
	const socket = io(); // automatically tries to connect on same port app was served from
	const username = document.getElementById('uname').innerText;
	const form = document.getElementById('chatForm');
	const messages = document.getElementById('messages');
	const messageToSend = document.getElementById('txt');

	welcome(username);
	socket.emit('log in', username);

	// when user submit a message
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
		message.innerText = `<strong><u>${msg.user}</u></strong> : ${msg.message}`;
		messages.appendChild(message);
		messages.scrollTop = messages.scrollHeight;
	});

	// display welcome message
	function welcome(username) {
		const message = document.createElement('li');
		message.innerText = `<strong><u>BlooChatApp</u></strong>  Welcome ${username}!`;
		messages.appendChild(message);
	}

	// display user exit message
	socket.on('leave chat', (name) => {
		if (name) {
			const message = document.createElement('li');
			message.innerText = `<strong><u>BlooChatApp</u></strong>  ${name} left the chat`;
			message.style.backgroundColor = 'red';
			messages.appendChild(message);
		}
	});

	// show online users
	socket.on('online', (users) => {
		const message = document.createElement('li');
		if (users.length === 1) {
			message.innerText = `<strong><u>BlooChatApp</u></strong>  Unfortunately no one is online at the moment`;
		} else {
			pps = '';
			for (i = 0; i < users.length; i++) {
				if (users[i] != username) {
					pps += users[i];
					pps += ' ';
				}
			}
			message.innerText = `<strong><u>BlooChatApp</u></strong>  Online users: ${pps}`;
		}
		messages.appendChild(message);
	});

	// display user entrance message
	socket.on('enter chat', (name) => {
		const message = document.createElement('li');
		message.innerText = `<strong><u>BlooChatApp</u></strong>  <strong>${name}</strong> entered group chat`;
		message.style.backgroundColor = 'green';
		messages.appendChild(message);
	});

	socket.on('error', () => {
		window.alert('register first!');
	});
});
