const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('New client connected', socket.id);

    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`Client ${socket.id} joined room ${room}`);
    });

    socket.on('sendMessage', (message) => {
        console.log('Message received:', message);
        io.to(message.channel).emit('receiveMessage', message);
    });

    socket.on('typing', (data) => {
        console.log('typing:', data);
        socket.to(data.channel).emit('typing', data);
    });

    socket.on('stopTyping', (data) => {
        socket.to(data.channel).emit('stopTyping', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id);
    });
});

server.listen(4000, () => {
    console.log('Listening on port 4000');
});
