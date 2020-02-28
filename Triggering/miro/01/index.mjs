import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = new Map();
let clientPosition = []; // stores client window position settings

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

wss.on('connection', (ws, req) => {
  const id = req.headers['sec-websocket-key'];
  clients.set(id, ws);
  clientPosition.push(id);
  // console.log('---- added client  ', id, clients);

  ws.isAlive = true;
  ws.on('pong', heartbeat);

  ws.on('message', (data) => {
    // log the received message and send it back to the client
    console.log('received: %s', data);
    const msg = JSON.parse(data);
    if (!msg && !msg.type) return;

    switch(msg.type) {
      case 'request-position-change':
        updateClientPosition(id, msg.data.clientPosition);
        break;
      case 'log':
        console.log('Message from client: ', event.data);
        break;
    }
    // ws.send(message('log', `Server received -> ${data}`));
  });

  broadcastClientCount(clients.size);

  ws.on('close', () => {
    clients.delete(id);
    const idIndex = clientPosition.indexOf(id);
    if (idIndex !== -1) clientPosition.splice(idIndex, 1);

    broadcastClientCount(clients.size);
    // console.log('---- removed client', id);
  });
});

function message(type, data) {
  return JSON.stringify({ type, data })
}

function broadcastClientCount(clientCount) {
  // broadcast the new nr of connected clients
  clients.forEach((client, key) => {
    client.send(message('client-count', { clientCount, clientPosition: clientPosition.indexOf(key) }));
  });
}

function updateClientPosition(id, position) {
  const indexA = parseInt(position);
  const indexB = clientPosition.indexOf(id);
  if (indexA === -1 && indexB === -1) return;

  // swap positions
  const temp = clientPosition[indexA];
  clientPosition[indexA] = clientPosition[indexB];
  clientPosition[indexB] = temp;

  broadcastClientCount(clients.size);
}

// connection helpers
// https://github.com/websockets/ws#how-to-detect-and-close-broken-connections
const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping(noop);
  });
}, 30000);
function noop() {}
function heartbeat() { this.isAlive = true; }

wss.on('close', function close() {
  clearInterval(interval);
});

server.listen(3000, () => {
  console.log(`listening on *:${server.address().port}`);
});
