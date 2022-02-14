import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ReflectionHelper } from './reflection.helper';

const test = suite('ReflectionHelper');

test('should manage Reflect metadata correctly', () => {
  class TestClass {}

  const reflectionHelperOne = new ReflectionHelper<unknown>('test:metadata');
  const reflectionHelperTwo = new ReflectionHelper<unknown>('test:metadata:two');

  reflectionHelperOne.set('test value', TestClass);

  assert.not.ok(reflectionHelperTwo.exists(TestClass));
  assert.ok(reflectionHelperOne.exists(TestClass));
  assert.is(reflectionHelperOne.get(TestClass), 'test value');
});

test.run();
