import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import express from 'express';
import https from 'https';
import socketIO from 'socket.io';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

const credentials = {
  key: fs.readFileSync(`${process.env['HOME']}/.localhost-ssl/localhost.key`, 'utf8'),
  cert: fs.readFileSync(`${process.env['HOME']}/.localhost-ssl/localhost.crt`, 'utf8'),
};

const server = https.createServer(credentials, app);

const io = socketIO(server);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  console.log('hallo');

  socket.on('disconnect', function () {
  });

});

server.listen(8080, function () {
  console.log('listening on *:8080');
});