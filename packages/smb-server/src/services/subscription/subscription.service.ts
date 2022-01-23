import { Injectable } from 'peque-di';

@Injectable()
export class SubscribeService {
  #subscriptions = new Map<string, string[]>();

  set(pattern: string, socketId: string) {
    const subscriptions = this.#subscriptions.get(pattern) || [];
    subscriptions.push(socketId);
    this.#subscriptions.set(pattern, subscriptions);
  }

  find(pattern: string): string[] {
    const sockets: string[] = [];
    for (const key in this.#subscriptions.keys()) {
      if (key.match(new RegExp(pattern))) {
        const values = [...new Set(this.#subscriptions.get(key))];
        sockets.concat(...values);
      }
    }

    return sockets;
  }
}
