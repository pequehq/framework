import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { loadProviders, unloadProviders } from '../../../test/di';
import { Field, Parent, Query, Resolver } from '../../decorators';
import { diHelper } from '../../helpers';
import { ResolverService } from './resolver.service';

const test = suite('ResolverService');

test.before.each(() => {
  loadProviders();
});

test.after.each(() => {
  unloadProviders();
});

test.skip('should load the resolvers', async () => {
  @Resolver()
  class ResolverTest {
    @Query()
    query() {
      console.log('query');
    }

    @Field({ type: 'String' })
    test(@Parent() parent) {
      console.log('test');
    }
  }

  const resolverService = diHelper.get().get<ResolverService>('ResolverService');
  const resolvers = resolverService.loadResolvers();

  console.log(resolvers);
  assert.is(1, 1);
});

test.run();
