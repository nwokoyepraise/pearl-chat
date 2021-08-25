const express = require('express');
const app = express();
const server = require('http').createServer(app);
const port_number = 3000;
const io = require('socket.io')(server);

app.use(express.static("public"));

try {

    app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));
    app.get('/chat', (req, res) => res.sendFile(__dirname + '/public/html/chat.html'));

    const namespace = io.of('/chat');

    io.on('connection', client => {
        console.log('user connected')
        client.on('create_room', (room_number) => {
            console.log(`client ${client.id} created and redirected to room ${room_number}!`);
            client.emit('redirect', room_number);
        });
        client.on('join_room', (room_number) => {
            console.log(`client ${client.id} joined and redirected to room ${room_number}!`);
            client.emit('redirect', room_number);
        });
        // client.on('event', data => { /* … */ });
        client.on('disconnect', () => { console.log(`client ${client.id} disconnected!`) });
    });

    namespace.on('connection', client => {
        client.on('join_room', (room_number) => {
            client.join(room_number);
            console.log(`client ${client.id} joined room ${room_number}!`);
        });
        client.on('message', message => {
            namespace.emit('message', message);
        });
    });

} catch (error) {
    console.error(error)
}

server.listen(port_number, () => {
    console.log(`server listening on port ${port_number}`)
})