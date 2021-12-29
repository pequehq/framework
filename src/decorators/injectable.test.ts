import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { Injector } from '../models/dependency-injection/injector.service';
import { Providers } from '../models/dependency-injection/provider.service';
import { loadInjectables } from '../utils/dependencies.utils';
import { Inject, Injectable } from './injectable';

const test = suite('Injectable');

test.before.each(() => {
  Providers.unsetAll();
});

test('@Injectable should make the decorated class available via dependency injection', async () => {
  @Injectable()
  class TestService {}

  await loadInjectables();

  const instance = Injector.resolve<TestService>('injectable', 'TestService');
  assert.instance(instance, TestService);
});

test('@Inject should inject an instance of the decorated class', async () => {
  @Injectable()
  class TestService {
    testMethod(): string {
      return 'value';
    }
  }

  class TestClass {
    @Inject('TestService')
    testService: TestService;
  }

  await loadInjectables();

  const subject = new TestClass();

  assert.instance(subject.testService, TestService);
  assert.is(subject.testService.testMethod(), 'value');
});

test.run();
