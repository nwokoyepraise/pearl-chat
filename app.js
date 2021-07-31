const express = require('express');
const app = express();
const server = require('http').createServer(app);
const port_number = 3000;
const io = require('socket.io')(server);

app.use(express.static("public"));

try {

    app.get('/', (req, res) => res.sendFile(__dirname + '/chat.html'));

} catch (error) {
    console.error(error)
}

server.listen(port_number, () => {
    console.log(`server listening on port ${port_number}`)
})