import { Server, ServerOptions } from 'socket.io';

import { Injectable } from '../../decorators';
import { WebSocketAdapter } from '../../models/interfaces/web-sockets/websocket-adapter.interface';
import { EventManagerService } from '../events/event-manager.service';

@Injectable()
export class SocketIoServiceAdapter implements WebSocketAdapter {
  protected server: Server;

  constructor(private readonly eventManager: EventManagerService) {}

  close(): void {
    this.server.disconnectSockets(true);
  }

  create(port: number, options?: ServerOptions): Server {
    this.server = new Server(options);
    this.server.on('connect', (socket) => {
      socket.onAny((event: string, data: unknown) => this.eventManager.push(`ws.${event}`, data));
    });
    this.server.listen(port);
    return this.server;
  }
}
