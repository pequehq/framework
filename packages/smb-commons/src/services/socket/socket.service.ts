import { Injectable } from 'peque-di';

import { BrokerSocket } from '../../models';

@Injectable()
export class SocketService {
  #sockets = new Map<string, BrokerSocket>();

  get(id: string): BrokerSocket | undefined {
    return this.#sockets.get(id);
  }

  set(socket: BrokerSocket): void {
    this.#sockets.set(socket.id, socket);
  }

  has(id: string): boolean {
    return this.#sockets.has(id);
  }

  close(id: string): void {
    this.#sockets.get(id)?.destroy();
    this.#sockets.delete(id);
  }

  closeAll(): void {
    for (const socket of this.#sockets.values()) {
      socket.destroy();
    }
    this.#sockets.clear();
  }
}
