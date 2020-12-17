const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidv4 } = require("uuid");
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

// view
app.set("view engine", "ejs");

// public file go here
// javascript for the front-end in script.js file
app.use(express.static("public"));

app.use('/peerjs', peerServer);

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    // user connected to zoom with specific user's id
    socket.to(roomId).broadcast.emit("user-connected", userId);
    // send the message for unit room 
    socket.on('message', message => {
      io.to(roomId).emit('createMessage', message)
    })
  });
});

server.listen(process.env.PORT || 3000);
