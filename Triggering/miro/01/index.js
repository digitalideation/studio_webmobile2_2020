const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = 3000;

let clients = new Set();

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  // console.log('a user connected');
  clients.add(socket.id);
  console.log('added ', socket.id);
  // socket.on('connect', () => { emitConnected(connectCounter++) });
  socket.on('disconnect', () => {
    console.log('removed ', socket.id);
    clients.delete(socket.id);
  });

  socket.on('animate', () => {
    // io.sockets.socket(socketId).emit(true);
  });
  console.log('clients ', clients);
});

http.listen(port, function(){
  console.log(`listening on *:${port}`);
});