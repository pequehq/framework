import { Injectable } from 'peque-di';

@Injectable()
export class SubscribeService {
  #subscriptions = new Map<string, string[]>();

  set(pattern: string, socketId: string): void {
    const subscriptions = this.#subscriptions.get(pattern) ?? [];
    subscriptions.push(socketId);
    this.#subscriptions.set(pattern, subscriptions);
  }

  unset(pattern: string, socketId: string): void {
    const subscriptions = this.#subscriptions.get(pattern) ?? [];
    this.#subscriptions.set(
      pattern,
      subscriptions.filter((subs) => subs !== socketId),
    );
  }

  find(pattern: string): string[] {
    const sockets: string[] = [];
    for (const key of this.#subscriptions.keys()) {
      if (new RegExp(key).test(pattern)) {
        const values = [...new Set(this.#subscriptions.get(key))];
        sockets.push(...values);
      }
    }

    return [...new Set(sockets)];
  }

  clear(): void {
    this.#subscriptions.clear();
  }
}
