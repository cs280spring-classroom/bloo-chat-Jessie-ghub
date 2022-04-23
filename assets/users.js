document.addEventListener('DOMContentLoaded', (_event) => {
	// Connect to socket.io
	const socket = io(); // automatically tries to connect on same port app was served from
	const submitBtn = document.getElementById('submit');
	const joinBtn = document.getElementById('join');
	const name = document.getElementById('newName').value;
	const pass = document.getElementById('newPass').value;
	//const form = document.getElementById('chatForm');
	const login_name = document.getElementById('txt1');
	const login_pass = document.getElementById('txt2');

	submitBtn.addEventListener('click', (event) => {
		if (name != '' && pass != '') {
			socket.emit('add user', name, pass);
			window.alert('success!');
		} else {
			window.alert('invalid input!');
		}
		event.preventDefault();
	});
	joinBtn.addEventListener('click', (event) => {
		if (login_name.value != '' && login_pass.value != '') {
			socket.emit('login', login_name.value, login_pass.value);
		} else {
			window.alert('invalid input!');
		}
		event.preventDefault();
	});
});
