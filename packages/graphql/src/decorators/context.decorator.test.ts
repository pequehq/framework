import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ResolverParametersMetadata } from '../constants/metadata.constants';
import { IResolverParameterMetadata } from '../interfaces';
import { Context } from './context.decorator';

const test = suite('@Context');

test('should load @Context metadata', async () => {
  const metadata: IResolverParameterMetadata[] = [
    { method: 'methodOne', type: 'ctx', index: 0, key: undefined },
    { method: 'methodTwo', type: 'ctx', index: 0, key: 'param' },
  ];

  class ResolverTest {
    methodOne(@Context() ctx: unknown): void {
      // noop.
    }

    methodTwo(@Context('param') ctx: unknown): void {
      // noop.
    }
  }

  assert.equal(ResolverParametersMetadata.get(ResolverTest), metadata);
});

test.run();
