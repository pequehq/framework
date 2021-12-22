import { Server, ServerOptions, Socket } from 'socket.io';
import { Injectable } from '../../decorators/injectable';
import { EventManager } from '../events/event-manager.service';
import { WebSocketAdapter } from '../../models/interfaces/web-sockets/websocket-adapter.interface';

@Injectable()
export class SocketIoServiceAdapter implements WebSocketAdapter {
  protected server: Server;

  close(): void {
    this.server.disconnectSockets(true);
  }

  create(port: number, options?: ServerOptions): Server {
    this.server = new Server(options);
    this.server.on('connect', socket => {
      socket.onAny((event: string, data: unknown) => EventManager.push(`ws.${event}`, data));
    });
    this.server.listen(port);
    return this.server;
  }

  onConnect(): void {
    throw new Error('Method not implemented.');
  }

  onDisconnect(): void {
    throw new Error('Method not implemented.');
  }

  onMessage(): void {
    throw new Error('Method not implemented.');
  }
}
