import { Injectable } from '../../decorators/_index';

@Injectable()
export class MemoryStoreService {
  private store = new Map<string, any>();

  set(key: string, value: any, ttl = undefined) {
    this.store.set(key, value);
    if (ttl) {
      setTimeout(() => this.delete(key), ttl);
    }
  }

  get(key: string) {
    return this.store.get(key);
  }

  delete(key: string) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}
