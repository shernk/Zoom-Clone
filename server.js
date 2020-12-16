const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require('socket.io')(server)
const { v4: uuidv4 } = require("uuid");

// view
app.set("view engine", "ejs");

// public file go here
// javascript for the front-end in script.js file
app.use(express.static('public'))

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on('connection', socket => {
  socket.on('join-room', () => {
    console.log('joined-room');
  })
})

server.listen(3000);
