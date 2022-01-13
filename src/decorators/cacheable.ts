import { CacheManager } from '../models';
import { NATIVE_SERVICES } from '../models/constants/native-services';
import { Injector } from '../models/dependency-injection/dependency-injection.service';

interface CacheOptions {
  key: string | ((...args: unknown[]) => string);
  ttl?: number;
}

export function Cacheable(options: CacheOptions): MethodDecorator {
  return <TValue>(target, propertyKey, descriptor): TypedPropertyDescriptor<TValue> => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]): Promise<TValue> {
      const cacheService = Injector.resolve<CacheManager>('injectable', NATIVE_SERVICES.CACHE);
      const key = typeof options.key === 'function' ? options.key(args) : options.key;
      const cachedValue = await cacheService.get<TValue>(key);

      if (cachedValue) {
        return cachedValue;
      }

      const result = await Promise.resolve(originalMethod.apply(this, args));
      cacheService.set(key, result, options.ttl);
      return result;
    };

    return descriptor;
  };
}
