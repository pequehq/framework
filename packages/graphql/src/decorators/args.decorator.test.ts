import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ResolverParametersMetadata } from '../constants/metadata.constants';
import { IResolverParameterMetadata } from '../interfaces';
import { Args } from './args.decorator';

const test = suite('@Args');

test('should load @Args metadata', async () => {
  const metadata: IResolverParameterMetadata[] = [
    { method: 'methodOne', type: 'args', index: 0, key: undefined },
    { method: 'methodTwo', type: 'args', index: 0, key: 'param' },
  ];

  class ResolverTest {
    methodOne(@Args() args: unknown): void {
      // noop.
    }

    methodTwo(@Args('param') args: unknown): void {
      // noop.
    }
  }

  assert.equal(ResolverParametersMetadata.get(ResolverTest), metadata);
});

test.run();
