module.exports = function (io) {
  const namespace = io.of("/chat");

  namespace.on("connection", (client) => {
    client.on("join_room", (room_number) => {
      client.join(room_number);
      console.log(`client ${client.id} joined room ${room_number}!`);
    });
    client.on("message", (message) => {
      client.to(message.room_number).emit("message", message.message);
    });
  });
};
