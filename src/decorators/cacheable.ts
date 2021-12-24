import { CacheManager } from '../models';
import { Injector } from '../models/dependency-injection/injector.service';
import { NATIVE_SERVICES } from '../models/constants/native-services';

interface CacheOptions {
  key: string | ((...args: unknown[]) => string);
  ttl?: number;
}

export function Cacheable(options: CacheOptions): MethodDecorator {
  return <TValue>(target, propertyKey, descriptor): TypedPropertyDescriptor<TValue> => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]): Promise<TValue> {
      const cacheService = Injector.resolve<CacheManager>('injectable', NATIVE_SERVICES.CACHE_SERVICE);
      const key = typeof options.key === 'function' ? options.key(args) : options.key;
      const cachedValue = await cacheService.get<TValue>(key);

      if (cachedValue) {
        return cachedValue;
      }

      const result = await originalMethod.apply(this, args);
      cacheService.set(key, result, options.ttl);
      return result;
    };

    return descriptor;
  };
}
