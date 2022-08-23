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

    socket.on('objectDrawed',(res, name)=>{
        const drawData = res;
        const nameShape = name;
        socket.to(nameRoom).emit('objectDrawed', drawData, nameShape);
    })
    socket.on('objectRemoved',(res)=>{
        const removeData = res;
        socket.to(nameRoom).emit('objectRemoved', removeData);
    })
    socket.on('objectModified',(res, activeObjectNames)=>{
        const modifyData = res;
        const names = activeObjectNames;
        socket.to(nameRoom).emit('objectModified', modifyData,names);
    })
    socket.on('colorChanged', (obj, color)=>{
        const objData = obj;
        const shapeColor = color;
        socket.to(nameRoom).emit('colorChanged', objData, shapeColor);
    })
    socket.on('textChanged',(res)=>{
        const textData = res;
        socket.to(nameRoom).emit('textChanged', textData);
    })
});

server.listen(8080,()=>{
    console.log('Server ready Port 8080')
})



