const { Server } = require('socket.io');
const express = require('express');
const cors = require('cors');


const app = express();
const httpServer = require('http').createServer(app);


const io = new Server(httpServer, {
  cors: {
    origin: '*' // Replace '*' with your specific origins if needed
  }
});


const users = {};


io.on('connection', (socket) => {
    socket.on('new-user-joined', (name) => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });


    socket.on('send', (message) => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });


    socket.on('disconnect', () => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});


const PORT = 8000;


httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



