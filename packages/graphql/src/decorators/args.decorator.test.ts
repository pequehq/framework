import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ResolverParametersMetadata } from '../constants/metadata.constants';
import { IResolverParameterMetadata } from '../interfaces';
import { Args } from './args.decorator';

const test = suite('@Args');

test('should load @Args metadata', async () => {
  const metadata: IResolverParameterMetadata = { method: 'method', type: 'args', index: 0 };

  class ResolverTest {
    method(@Args() args: unknown): void {
      // noop.
    }
  }

  assert.equal(ResolverParametersMetadata.get(ResolverTest), [metadata]);
});

test.run();
