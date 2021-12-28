import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ProviderClass } from '../models';
import { Injector } from '../models/dependency-injection/injector.service';
import { loadInjectables } from '../utils/dependencies.utils';
import { Injectable } from './injectable';

const test = suite('Injectable');

test('should make the decorated class available via dependency injection', async () => {
  @Injectable()
  class TestService {}

  await loadInjectables();

  const testService = Injector.resolve<ProviderClass>('injectable', 'TestService');
  assert.is(testService.constructor.name, 'TestService');
});

test.run();
