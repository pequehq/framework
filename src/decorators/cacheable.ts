import { Injector } from '../models/dependency-injection/injector.service';
import { CacheManager } from '../models/interfaces/cache/cache-client.abstract';

interface CacheOptions {
  key: string | (() => void);
  server?: string;
  ttl?: number;
}

export const Cacheable = (options: CacheOptions) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = async (...args) => {
      const cacheService = Injector.resolve<CacheManager>('CacheService');
      const key = typeof options.key === 'function' ? options.key.apply(this, args) : options.key;
      const cache = await cacheService.get(key);
      if (cache) {
        return cache;
      } else {
        const original = await Promise.resolve(originalMethod.apply(this, args));
        await cacheService.set(key, original, 0);
        return original;
      }
    };

    return descriptor;
  };
};
