import { Injectable } from '../../decorators';

@Injectable()
export class MemoryStoreService {
  #store = new Map<string, unknown>();

  set<TValue>(key: string, value: TValue, ttl?: number): void {
    this.#store.set(key, value);

    if (ttl) {
      // @TODO make use of clearTimeout on destroy to avoid memory leaks
      setTimeout(() => this.delete(key), ttl);
    }
  }

  get<TValue>(key: string): TValue {
    return this.#store.get(key) as TValue;
  }

  delete(key: string): void {
    this.#store.delete(key);
  }

  clear(): void {
    this.#store.clear();
  }
}
