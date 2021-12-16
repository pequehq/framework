import { Injectable } from '../../decorators/_index';

@Injectable()
export class MemoryStoreService {
  private store = new Map<string, any>();

  set(key: string, value: any, ttl = undefined): void {
    this.store.set(key, value);
    if (ttl) {
      setTimeout(() => this.delete(key), ttl);
    }
  }

  get(key: string): unknown {
    return this.store.get(key);
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}
