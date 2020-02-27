const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = 3000;

let clients = new Set();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const nsp = io.of('/animation');

nsp.on('connection', (socket) => {
  clients.add(socket.id);
  console.log('---- added client  ', socket.id);

  socket.on('disconnect', () => {
    clients.delete(socket.id);
    console.log('---- removed client', socket.id);
  });

  console.log('---- clients:      ', clients);

  const first = clients.values().next().value;
  nsp.emit('animate', 'everyone');
  console.log('---- send to all:  ', first);
  socket.broadcast.to(first).emit('animate', 'private');
  console.log('---- send to one:  ', socket.broadcast.to(first));
});

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});