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

    socket.on('draw',(res, name)=>{
        const drawData = res;
        const nameShape = name;
        socket.to(nameRoom).emit('draw', drawData, nameShape);
    })
    socket.on('remove',(res)=>{
        const removeData = res;
        socket.to(nameRoom).emit('remove', removeData);
    })
    socket.on('modify',(res, activeObjects)=>{
        const modifyData = res;
        const activeObjectsData = activeObjects;
        console.log('en server: ', res, activeObjects)
        socket.to(nameRoom).emit('modify', modifyData,activeObjectsData);
    })
    socket.on('colorChanged', (obj, color)=>{
        const objData = obj;
        const shapeColor = color;
        console.log("en server ", obj, color)
        socket.to(nameRoom).emit('colorChanged', objData, shapeColor);
    })
});

server.listen(8080,()=>{
    console.log('Server ready Port 8080')
})



