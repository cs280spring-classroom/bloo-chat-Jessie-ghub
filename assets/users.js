document.addEventListener('DOMContentLoaded', (_event) => {
	// Connect to socket.io
	const socket = io(); // automatically tries to connect on same port app was served from
	const submitBtn = document.getElementById('submit');
	const name = document.getElementById('newName');
	const pass = document.getElementById('newPass');

	submitBtn.addEventListener('click', async (event) => {
		if (name.value != '' && pass.value != '') {
			socket.emit('add user', name.value, pass.value);
			window.alert('Account created! chat now');
		} else {
			window.alert('invalid input');
		}
		event.preventDefault();
	});
});
