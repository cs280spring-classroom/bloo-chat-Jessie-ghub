[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-c66648af7eb3fe8bc4f294546bfd86ef473780cde1dea487d3c4ff354943c9ae.svg)](https://classroom.github.com/online_ide?assignment_repo_id=7629240&assignment_repo_type=AssignmentRepo)
# Homework 5: Bloo Chat!

A simple realtime messaging application build with Node, Express, and Socket.io.

After cloning the application, run `npm install` to install the dependencies. 

To run the application, use the command `npm run dev`.

This app uses Socket.io to create a real time web server that accept connections from the client. (deployed at index.js)

When a user connect, it creates a new socket (client). Clients collect information like username and password (from njk files, where user submit files and input messages) and forward them to the server. The server is able to broadcast info and commands to all clients connected.
(deployed at script.js)

App.get() function in index.js define route handlers so that when click 'join' it jumps from welcome page (index.njk) to message page (chatroom.njk). We also took advantage of it to handle user registration.

The user data is stored on Mongodb (models/User.js) and password is hashed and salted ('./util/hashing')

Detailed instructions are at this [url](https://cs280spring.github.io/hw/hw5/index.html).

The application is deployed on [Heroku](https://bloochat-jluo30.herokuapp.com).
ATTENTION: on the deployed app you need to refresh page after you register or enter wrong username/password。 If the deployment link is not working, please try run locally, everything works well.
