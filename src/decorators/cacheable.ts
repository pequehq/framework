import { Injector } from '../models/dependency-injection/injector.service';
import { CacheManager } from '../models/interfaces/cache/cache-client.abstract';

interface CacheOptions {
  key: string | (() => string);
  ttl?: number;
}

export function Cacheable(options: CacheOptions): MethodDecorator {
  return <T>(target, propertyKey, descriptor): TypedPropertyDescriptor<T> => {
    const originalMethod = descriptor.value;

    descriptor.value = async (...args) => {
      const cacheService = Injector.resolve<CacheManager>('CacheService');
      const key = typeof options.key === 'function' ? options.key.apply(this, args) : options.key;
      const cache = await cacheService.get(key);

      if (cache) {
        return cache;
      }

      const original = await Promise.resolve(originalMethod.apply(this, args));
      cacheService.set(key, original, options.ttl);
      return original;
    };

    return descriptor;
  };
}
