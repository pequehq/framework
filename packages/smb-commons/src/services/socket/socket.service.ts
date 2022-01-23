import { Injectable } from 'peque-di';

import { IBrokerSocket } from '../../models';

@Injectable()
export class SocketService {
  private sockets = new Map<string, IBrokerSocket>();

  get(id: string): IBrokerSocket | undefined {
    return this.sockets.get(id);
  }

  set(id: string, socket: IBrokerSocket): void {
    this.sockets.set(id, socket);
  }

  has(id: string): boolean {
    return this.sockets.has(id);
  }

  close(id: string): void {
    this.sockets.get(id)?.destroy();
    this.sockets.delete(id);
  }

  closeAll(): void {
    for (const socket of this.sockets.values()) {
      socket.destroy();
    }
    this.sockets.clear();
  }
}
