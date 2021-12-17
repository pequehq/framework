import { Cacheable } from '../src/decorators/cacheable';
import { Injector } from '../src/models/dependency-injection/injector.service';
import { CacheManager } from '../src/models/interfaces/cache/cache-client.abstract';
import { loadInjectables } from '../src/utils/dependencies.utils';

class MockCacheService implements CacheManager {
  cache: Record<string, unknown> = {};

  async get<T>(key: string): Promise<T> {
    return this.cache[key] as T;
  }

  async set<T>(key: string, value: T): Promise<void> {
    this.cache[key] = value;
  }
}

describe('@Cacheable decorator', () => {
  beforeAll(async () => await loadInjectables());

  it('should set and read from cache', async () => {
    await Injector.set('CacheService', MockCacheService);
    await loadInjectables();

    const mockCacheService: CacheManager = Injector.resolve('CacheService');

    class TestClass {
      @Cacheable({ key: 'testKey' })
      async testMethod() {
        return 'test value';
      }
    }

    const testClass = new TestClass();

    expect(await mockCacheService.get('testKey')).toBeUndefined();
    const firstRead = await testClass.testMethod();
    expect(firstRead).toBe('test value');
    expect(await mockCacheService.get('testKey')).toBe('test value');

    const secondRead = await testClass.testMethod();
    expect(secondRead).toBe('test value');
  });
});
