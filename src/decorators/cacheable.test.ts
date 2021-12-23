import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { CacheManager } from '../models';
import { Injector } from '../models/dependency-injection/injector.service';
import { loadInjectables } from '../utils/dependencies.utils';
import { Cacheable } from './cacheable';

const test = suite('Cacheable');

class MockCacheService implements CacheManager {
  #cache: Record<string, unknown> = {};

  async get<T = unknown>(key: string): Promise<T> {
    return this.#cache[key] as T;
  }

  async set<T = unknown>(key: string, value: T): Promise<void> {
    this.#cache[key] = value;
  }
}

test.before(async () => {
  await loadInjectables();
});

test('should set and read from cache', async () => {
  await Injector.set('CacheService', MockCacheService);

  const cacheService = Injector.resolve<CacheManager>('CacheService');

  class TestClass {
    testMethodCalls = 0;

    @Cacheable({ key: 'key' })
    async testMethod() {
      this.testMethodCalls++;
      return 'value';
    }
  }

  const testClass = new TestClass();

  assert.is(testClass.testMethodCalls, 0);
  assert.is(await cacheService.get('key'), undefined);

  const firstRead = await testClass.testMethod();
  assert.is(testClass.testMethodCalls, 1);
  assert.is(firstRead, 'value');

  assert.is(await cacheService.get('key'), 'value');

  const secondRead = await testClass.testMethod();
  assert.is(testClass.testMethodCalls, 1);
  assert.is(secondRead, 'value');
});

test.run();
