import { Injectable } from '../../decorators/_index';

@Injectable()
export class MemoryStoreService {
  private store = new Map<string, unknown>();

  set<TValue>(key: string, value: TValue, ttl?: number): void {
    this.store.set(key, value);

    if (ttl) {
      setTimeout(() => this.delete(key), ttl);
    }
  }

  get<TValue>(key: string): TValue {
    return this.store.get(key) as TValue;
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}
