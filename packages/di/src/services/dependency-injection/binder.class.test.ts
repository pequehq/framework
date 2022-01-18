import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { IDependency, ProviderClass } from '../../models';
import { Binder, IProviderBinding } from './binder.class';

const test = suite('Binder');

test('should instantiate a provider binding', () => {
  class TestBinding {}

  const testBinding: IProviderBinding = {
    provider: TestBinding,
    to: TestBinding,
    dependencies: new Map<ProviderClass, IDependency[]>().set(TestBinding, []),
  };
  const binding = new Binder(TestBinding);

  assert.equal(binding.getBinding(), testBinding);
  assert.is(binding.getProvider(), TestBinding);
});

test.run();
