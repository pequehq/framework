import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ResolverStorage } from './resolver-storage.service';

const test = suite('ResolverStorage');

test.before.each(() => {
  class ResolverOne {}
  class ResolverTwo {}

  ResolverStorage.set(ResolverOne);
  ResolverStorage.set(ResolverTwo);
  ResolverStorage.set(ResolverTwo);
});

test.after.each(() => {
  ResolverStorage.clear();
});

test('should get all the resolvers', () => {
  assert.is(ResolverStorage.getAll().length, 2);
});

test('should clear the resolvers', () => {
  assert.is(ResolverStorage.getAll().length, 2);

  ResolverStorage.clear();

  assert.is(ResolverStorage.getAll().length, 0);
});

test.run();
