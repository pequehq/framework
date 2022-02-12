import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ResolverParametersMetadata } from '../constants/metadata.constants';
import { IResolverParameterMetadata } from '../interfaces';
import { Ctx } from './ctx.decorator';

const test = suite('@Ctx');

test('should load @Ctx metadata', async () => {
  const metadata: IResolverParameterMetadata = { method: 'method', type: 'ctx', index: 0 };

  class ResolverTest {
    method(@Ctx() ctx: unknown): void {
      // noop.
    }
  }

  assert.equal(ResolverParametersMetadata.get(ResolverTest), [metadata]);
});

test.run();
