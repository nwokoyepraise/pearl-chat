const express = require('express');
const app = express();
const server = require('http').createServer(app);
const port_number = 3000;

server.listen(port_number, () => {
    console.log(`server listening on port ${port_number}`)
})