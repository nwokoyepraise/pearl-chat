const express = require("express");
const app = express();
const server = require("http").createServer(app);
require("./config/mongoConfig")();
const portNumber = process.env.PORT || process.env.PORT_NUMBER || 3000;
const io = require("socket.io")(server);
const user = require("./routes/user");
const auth = require("./routes/auth");
const instaChat = require("./routes/instaChat");
const chatSocket = require("./routes/chatSocket");

// Set the view engine to ejs
app.set("view engine", "ejs");
// Render static files
app.use(express.static("public"));
app.use(express.json());

//load routes
app.use("/user", user);
app.use("/auth", auth);
app.use("/insta_chat", instaChat);

app.get("/", (req, res) => res.render("pages/index"));
app.get("/chats/:room", (req, res) => res.render("pages/chats", { room: req.params.room }));

//Initialize socket
(() => {chatSocket(io)})();


server.listen(portNumber, () => {
  console.log(`server listening on port ${portNumber}`);
});
