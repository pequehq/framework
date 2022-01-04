import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { Injectable } from './decorators';
import { Injector } from './models/dependency-injection/injector.service';
import { loadInjectables } from './utils/dependencies.utils';

const test = suite('Dependency injection');

test('should work as expected', async () => {
  @Injectable()
  class PippoService {
    yell() {
      return 'aaaaah!!';
    }
  }

  @Injectable()
  class TestClass {
    constructor(public pippoService: PippoService) {}

    makePippoYell() {
      return this.pippoService.yell();
    }
  }

  await loadInjectables();

  const testClass = Injector.resolve<TestClass>('injectable', 'TestClass');

  assert.is(testClass.makePippoYell(), 'aaaaah!!');
});

test.run();
