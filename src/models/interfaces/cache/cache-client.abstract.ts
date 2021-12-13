export interface CacheManager {
  get(key: string);
  set(key: string, value: string, ttl: number);
}
