const express = require("express");
const app = express();
const server = require("http").createServer(app);
const port_number = 3000;
const io = require("socket.io")(server);
const user = require("./routes/user");
const auth = require("./routes/auth");
const isAuth = require("./middleware/isAuth");
const baseResponse = require("./middleware/baseResponse");
const ejs = require("ejs");

// Set the view engine to ejs
app.set("view engine", "ejs");
// Render static files
app.use(express.static("public"));
app.use(express.json());

//load routes
app.use("/user", user);
app.use("/auth", auth);

app.get("/", (req, res) => res.render("pages/index"));
app.get("/insta_chat", (req, res) => res.render("pages/insta-chat"));
app.get("/chats", (req, res) => res.render("pages/chats"));

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

server.listen(port_number, () => {
  console.log(`server listening on port ${port_number}`);
});
