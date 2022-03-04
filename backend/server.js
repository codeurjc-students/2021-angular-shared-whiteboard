const express = require('express');
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server, {
    cors: {
        origins: ['http://localhost:4200']
    }
});
io.on('connection', socket=>{
    const id_handshake = socket.id;
    const {nameRoom} = socket.handshake.query;

    socket.join(nameRoom);
    console.log(`Nuevo dispositivo conectado: ${id_handshake} a: ${nameRoom}`);
});
io.on('disconnect', socket=>{
    const id_handshake = socket.id;
    const {nameRoom} = socket.handshake.query;

    socket.join(nameRoom);
    console.log(`Nuevo dispositivo desconectado: ${id_handshake} de: ${nameRoom}`);
});
server.listen(8080,()=>{
    console.log('Server ready Port 8080')
})



