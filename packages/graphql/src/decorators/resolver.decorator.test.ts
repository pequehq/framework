import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ResolverStorage } from '../services';
import { Resolver } from './resolver.decorator';

const test = suite('@Resolver');

test.after.each(() => ResolverStorage.clear());

test('should load @Resolver metadata', async () => {
  @Resolver()
  class ResolverTestOne {}

  @Resolver()
  class ResolverTestTwo {}

  assert.equal(ResolverStorage.getAll(), [ResolverTestOne, ResolverTestTwo]);
});

test.run();
