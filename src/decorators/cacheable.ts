import { CacheManager } from '../models';
import { Injector } from '../models/dependency-injection/injector.service';

interface CacheOptions {
  key: string | ((...args: unknown[]) => string);
  ttl?: number;
}

export function Cacheable(options: CacheOptions): MethodDecorator {
  return <TValue>(target, propertyKey, descriptor): TypedPropertyDescriptor<TValue> => {
    const originalMethod = descriptor.value;

    descriptor.value = async (...args: unknown[]): Promise<TValue> => {
      const cacheService = Injector.resolve<CacheManager>('CacheService');
      const key = typeof options.key === 'function' ? options.key(args) : options.key;
      const cache = await cacheService.get<TValue>(key);

      if (cache) {
        return cache;
      }

      const result = await originalMethod(args);
      cacheService.set(key, result, options.ttl);
      return result;
    };

    return descriptor;
  };
}
