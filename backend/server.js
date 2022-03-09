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

    socket.on('draw',(res)=>{
        const drawData = res;
        socket.to(nameRoom).emit('draw', drawData);
    })
});

server.listen(8080,()=>{
    console.log('Server ready Port 8080')
})



