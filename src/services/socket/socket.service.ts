import { Socket } from 'net';

type SocketsType = 'http' | 'ws';

class SocketService {
  private sockets: Record<SocketsType, Set<Socket>> = {
    http: new Set<Socket>(),
    ws: new Set<Socket>(),
  };

  set(type: SocketsType, socket: Socket): void {
    this.sockets[type].add(socket);
  }

  has(type: SocketsType, socket: Socket): boolean {
    return this.sockets[type].has(socket);
  }

  delete(type: SocketsType, socket: Socket): void {
    socket.destroy();
    this.sockets[type].delete(socket);
  }

  closeAllByType(type: SocketsType): void {
    for (const socket of this.sockets[type].values()) {
      socket.destroy();
      this.sockets[type].clear();
    }
  }

  closeAll() {
    this.closeAllByType('http');
    this.closeAllByType('ws');
  }
}

export const Sockets = new SocketService();
