import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ResolverQueriesMetadata } from '../constants/metadata.constants';
import { IResolverQueryMetadata } from '../interfaces';
import { Query } from './query.decorator';

const test = suite('@Query');

test('should load @Parent metadata', async () => {
  const metadata: IResolverQueryMetadata[] = [
    { method: 'methodOne', options: undefined },
    { method: 'methodTwo', options: { name: 'location' } },
  ];

  class ResolverTest {
    @Query()
    methodOne(): void {
      // noop.
    }

    @Query({ name: 'location' })
    methodTwo(): void {
      // noop.
    }
  }

  assert.equal(ResolverQueriesMetadata.get(ResolverTest), metadata);
});

test.run();
