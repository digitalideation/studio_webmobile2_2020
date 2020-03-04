const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

const clients = new Set();

let first = true;

const trigRndClient = function () {
  const arr = Array.from(clients);
  const random = Math.floor(Math.random() * arr.length);
  io.to(`${arr[random]}`).emit('animate', true);
}

io.on('connection', function (socket) {

  // push id to array
  clients.add(socket.client.id);

  // trigger on first connection
  if (clients.size === 1 && first) {
    first = false;
    trigRndClient();
  }

  // remove id from array
  socket.on('disconnect', function () {
    clients.delete(socket.client.id);
    if (clients.size === 0) {
      first = true;
    }
  });

  // emit to random id
  socket.on('animated', function () {
    trigRndClient();
  });

});

http.listen(8080, function () {
  console.log('listening on *:8080');
});