export interface CacheManager {
  get<T>(key: string): Promise<T>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
}
