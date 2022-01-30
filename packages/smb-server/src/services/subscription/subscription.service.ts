import { Injectable } from '@peque/di';

@Injectable()
export class SubscribeService {
  #subscriptions = new Map<string, Set<string>>();

  set(pattern: string, socketId: string): void {
    const subscriptions = this.#subscriptions.get(pattern) ?? new Set<string>();
    subscriptions.add(socketId);
    this.#subscriptions.set(pattern, subscriptions);
  }

  unset(pattern: string, socketId: string): void {
    const subscriptions = new Set<string>(this.#subscriptions.get(pattern));
    this.#subscriptions.set(pattern, new Set([...subscriptions].filter((subs) => subs !== socketId)));
  }

  find(pattern: string): string[] {
    const sockets: string[] = [];
    for (const key of this.#subscriptions.keys()) {
      if (new RegExp(key).test(pattern)) {
        const values = [...new Set<string>(this.#subscriptions.get(key))];
        sockets.push(...values);
      }
    }

    return [...new Set(sockets)];
  }

  clear(): void {
    this.#subscriptions.clear();
  }
}
