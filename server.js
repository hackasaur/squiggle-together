const express = require('express');
const app = express();
app.use(express.static(__dirname + "/public/"));
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const strokes = []
let hostSocketId = ''

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

io.on('connection', (socket) => {
  console.log('a user joined')
  if (hostSocketId == '') {
    hostSocketId = socket.id
    console.log(hostSocketId)
  }

  socket.on('IjustJoined', () => {
    io.to(socket.id).emit('strokesSoFar', strokes)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('addThisStroke', (points) => {
    // console.log('message: ' + msg);
    socket.broadcast.emit('addThisStroke', points)
    strokes.push(points)
  });

  socket.on('redrawYourStrokes', (strokes) => {
    socket.broadcast.emit('redrawYourStrokes')
  })
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});