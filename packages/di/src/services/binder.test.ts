import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { Binder } from './binder';

const test = suite('Binder');

test('should instantiate a provider binding', () => {
  class TestProvider {}

  const binding = new Binder(TestProvider);

  assert.is(binding.getTargetProvider(), TestProvider);
});

test('should allow binding to a different target class', () => {
  class TestProvider {}
  class TestProviderTarget {}

  const binding = new Binder(TestProvider);
  binding.to(TestProviderTarget);

  assert.is(binding.getTargetProvider(), TestProviderTarget);
});

test.run();
