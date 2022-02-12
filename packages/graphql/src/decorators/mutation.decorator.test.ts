import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ResolverMutationsMetadata } from '../constants/metadata.constants';
import { IResolverMutationMetadata } from '../interfaces';
import { Mutation } from './mutation.decorator';

const test = suite('@Mutation');

test('should load @Mutation metadata', async () => {
  const metadata: IResolverMutationMetadata[] = [
    { method: 'methodOne', options: undefined },
    { method: 'methodTwo', options: { name: 'location' } },
  ];

  class ResolverTest {
    @Mutation()
    methodOne(): void {
      // noop.
    }

    @Mutation({ name: 'location' })
    methodTwo(): void {
      // noop.
    }
  }

  assert.equal(ResolverMutationsMetadata.get(ResolverTest), metadata);
});

test.run();
