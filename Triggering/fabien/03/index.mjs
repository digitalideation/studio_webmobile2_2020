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
app.use(express.static('modules'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

import RoleController from './modules/role-controller.mjs';
const roleController = new RoleController();

io.on('connection', function (socket) {
  roleController.clientConnection(socket);

  socket.on('clientRegistration', (role) => {
    switch (role) {
      case 'screen':
        roleController.screenRegistration(socket);
        break;
      case 'controller':
        roleController.controllerRegistration(socket);
        break;
      default:
        console.log('Role not defined');
    }
  });

  socket.on('disconnect', () => {
    roleController.clientDisconnection(io, socket);
  });
});

server.listen(8080, function () {
  console.log('listening on *:8080');
});