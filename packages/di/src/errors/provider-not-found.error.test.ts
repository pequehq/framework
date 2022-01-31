import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ProviderNotFoundError } from './provider-not-found.error';

const test = suite('ProviderNotFoundError');

test('should have a message stating that the provider was not found', () => {
  assert.throws(() => {
    throw new ProviderNotFoundError('TestProvider');
  }, 'Provider [TestProvider] not found.');
});

test.run();
