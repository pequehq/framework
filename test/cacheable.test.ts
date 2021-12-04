import { CacheManager } from '../src/models/interfaces/cache/cache-client.abstract';
import { Injector } from '../src/models/dependency-injection/injector.service';
import { Cacheable } from '../src/decorators/cacheable';
import { loadInjectables } from '../src/utils/dependencies.utils';

class MockCacheService implements CacheManager {
  cache: { [key: string]: any } = {}

  get(key: string) {
    return this.cache[key];
  }

  set(key: string, value: string, ttl: number) {
    this.cache[key] = value;
  }
}

describe('@Cacheable decorator', () => {
  Injector.set('CacheService', MockCacheService);
  loadInjectables();

  const mockCacheService: CacheManager = Injector.resolve('CacheService');

  class TestClass {
    @Cacheable({ key: 'testKey' })
    async testMethod() {
      return 'test value';
    }
  }

  const testClass = new TestClass();

  it ('should set and read from cache', async () => {
    expect(mockCacheService.get('testKey')).toBeUndefined();
    const firstRead = await testClass.testMethod();
    expect(firstRead).toBe('test value');
    expect(mockCacheService.get('testKey')).toBe('test value');

    const secondRead = await testClass.testMethod();
    expect(secondRead).toBe('test value');
  });
});
