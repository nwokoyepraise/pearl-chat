module.exports = function (io) {
  const namespace = io.of("/chat");

  namespace.on("connection", (client) => {
    client.on("join_room", (data) => {
      client.join(data.room);
      console.log(`client ${client.id} joined room ${data.room}!`);
    });
    client.on("message", (data) => {
      client.to(data.room).emit("message", data.message);
    });
  });
};
