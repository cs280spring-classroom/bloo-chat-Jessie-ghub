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
		const badge = document.createElement('span');
		badge.classList.add('badge');
		badge.innerText = msg.user;
		message.appendChild(badge);

		const text = document.createElement('span');
		text.innerText = msg.message;
		message.appendChild(text);

		messages.appendChild(message);
		messages.scrollTop = messages.scrollHeight;
	});

	// display welcome message
	function welcome(username) {
		const message = document.createElement('li');
		const badge = document.createElement('span');
		badge.classList.add('badge');
		badge.classList.add('green');
		badge.innerText = 'BlooChatApp';
		message.appendChild(badge);

		const text = document.createElement('span');
		text.innerText = `Welcome ${username}!`;
		text.classList.add('green');
		message.appendChild(text);

		messages.appendChild(message);
		messages.scrollTop = messages.scrollHeight;
	}

	// display user exit message
	socket.on('leave chat', (name) => {
		if (name) {
			const message = document.createElement('li');
			const badge = document.createElement('span');
			badge.classList.add('red');
			badge.classList.add('badge');
			badge.innerText = 'BlooChatApp';
			message.appendChild(badge);

			const text = document.createElement('span');
			text.innerText = `${name} left the chat`;
			text.classList.add('red');
			message.appendChild(text);

			messages.appendChild(message);
			messages.scrollTop = messages.scrollHeight;
		}
	});

	// show online users
	socket.on('online', (users) => {
		const message = document.createElement('li');
		const badge = document.createElement('span');
		badge.classList.add('badge');
		badge.classList.add('green');
		badge.innerText = 'BlooChatApp';
		message.appendChild(badge);

		const text = document.createElement('span');
		if (users.length === 1) {
			text.innerText = `Unfortunately no one is online at the moment`;
		} else {
			pps = '';
			for (i = 0; i < users.length; i++) {
				if (users[i] != username) {
					pps += users[i];
					pps += ' ';
				}
			}
			text.innerText = `Online users: ${pps}`;
		}
		text.classList.add('green');
		message.appendChild(text);

		messages.appendChild(message);
		messages.scrollTop = messages.scrollHeight;
	});

	// display user entrance message
	socket.on('enter chat', (name) => {
		const message = document.createElement('li');
		const badge = document.createElement('span');
		badge.classList.add('green');
		badge.classList.add('badge');
		badge.innerText = 'BlooChatApp';
		message.appendChild(badge);

		const text = document.createElement('span');
		text.innerText = ` ${name} entered group chat`;
		text.classList.add('green');
		message.appendChild(text);

		messages.appendChild(message);
		messages.scrollTop = messages.scrollHeight;
	});

	socket.on('error', () => {
		window.alert('register first!');
	});
});
