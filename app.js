const express = require('express');
const app = express();
const server = require('http').createServer(app);
const port_number = 3000;
const io = require('socket.io')(server);

app.use(express.static("public"));

try {

    app.get('/', (req, res) => res.sendFile(__dirname + '/chat.html'));

    io.on('connection', client => {
        console.log('user connected')
        client.on('create_room', (room_number)=>{
            console.log(`client ${client.id} created room ${room_number}!`);
            client.join(room_number);
        });
        client.on('join_room', (room_number)=>{
            client.join(room_number);
            console.log(`client ${client.id} joined room ${room_number}!`)
        });
        // client.on('event', data => { /* … */ });
        client.on('disconnect', () => { console.log(`client ${client.id} disconnected!`) });
    });

} catch (error) {
    console.error(error)
}

server.listen(port_number, () => {
    console.log(`server listening on port ${port_number}`)
})