module.exports = function (io) {
  const namespace = io.of("/chat");
  const instaChatController = require("../controllers/insta-chat.controller");

  namespace.on("connection", (client) => {
    client.on("join_room", (data) => {
      client.join(data.room);
      console.log(`client ${client.id} joined room ${data.room}!`);
    });
    client.on("message", async (data) => {
      client.to(data.room).emit("message", data.message);
      switch (data.type) {
        // case 'insta_chat':
        default:
          await instaChatController.saveMessage(data.room, { text: data.message }, data.user_id);
          break;
      }
    });
  });
};
