import { Container } from '@pequehq/di';
import sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { loadDI } from './di';

const test = suite('loadDI');

test('should do call .set for each provider', () => {
  const diSet = sinon.fake();
  const diContainer = { set: diSet } as unknown as Container;

  class ProviderOne {}
  class ProviderTwo {}

  loadDI(diContainer, [ProviderOne, ProviderTwo]);

  assert.ok(diSet.calledWith(ProviderOne, 'ProviderOne'));
  assert.ok(diSet.calledWith(ProviderTwo, 'ProviderTwo'));
});

test.run();
