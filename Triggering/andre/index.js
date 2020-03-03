const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');
const io = require('socket.io')(http); // hilft unter anderem, dass socket.js direkt vom root zugänglich ist

app.use(express.static(`${__dirname}/public`));

const connectedUsers = new Map();
let userNumberIdCounter = 0;

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/index.html`));
});

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * socket ist "user"
 * io ist server
 *
 * @events
 * - 'userConnectUpdate'
 * - 'animationChange'
 */
io.on('connection', (socket) => {
  console.log(`user ${socket.id} connected`);
  userNumberIdCounter++;

  let color = getRandomColor();

  // inform client about himself
  io.to(`${socket.id}`).emit('clientData', {
    socketId: socket.id,
    numberId: userNumberIdCounter,
    color: color,
  });

  // add user to map connectedUsers
  connectedUsers.set(userNumberIdCounter, {
    socketId: socket.id,
    color: color,
  });

  // transform map for emit
  let connectedUsersArray = JSON.stringify(Array.from(connectedUsers));

  // collect user data to send in event
  /**
   * send overall connected clients
   * user id of new client
   * conncted users
   */
  let dataToSendToAll = {
    clientsCount: io.engine.clientsCount,
    userId: socket.id,
    numberId: userNumberIdCounter,
    color: color,
    connectedUsersArray,
  };

  io.emit('userConnectUpdate', dataToSendToAll);


  socket.on('disconnect', () => {
    console.log(`user ${socket.id} disconnected`);
    let deletedNumberId;

    // eslint-disable-next-line no-restricted-syntax
    for (let [key, value] of connectedUsers) {
      if (value.socketId === socket.id) {
        connectedUsers.delete(key);
        deletedNumberId = key;
        console.log(`user with key ${key} (${socket.id}) deleted`);
        break;
      }
    }

    console.log(`now connected: ${connectedUsers.size}`);

    let deletedUser = {
      clientsCount: connectedUsers.size,
      userId: socket.id,
      deletedNumberId: deletedNumberId,
    };

    io.emit('userDisconnectUpdate', deletedUser);
  });

  // falls server 'chat message' empfängt
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
