export default class RoleController {
  constructor() {
    this.requiredScreens = 2;
    this.screens = new Set();
    this.controller = null;
  }

  isFull() {
    return this.screens.size === this.requiredScreens;
  }

  clientConnection(socket) {
    if(this.isFull()) {
      socket.emit('disable', 'screen');
    }
    if (this.controller) {
      socket.emit('disable', 'controller');
    }
  }

  screenRegistration(socket) {
    if (this.isFull()) {
      socket.emit('disable', 'screen');
    } else {
      this.screens.add(socket);
      socket.emit('approval', 'screen');
      if (this.isFull()) {
        socket.broadcast.emit('disable', 'screen');
      }
    }
  }

  controllerRegistration(socket) {
    if (this.controller) {
      socket.emit('disable', 'controller');
    } else {
      this.controller = socket;
      socket.emit('approval', 'controller');
      socket.broadcast.emit('disable', 'controller');
    }
  }

  clientDisconnection(io, socket) {
    if (this.screens.has(socket)) {
      this.screens.delete(socket);
      io.sockets.emit('enable', 'screen');
    } else if (this.controller === socket) {
      this.controller = null;
      io.sockets.emit('enable', 'controller');
    }
  }
}


