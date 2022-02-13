import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ResolverParametersMetadata } from '../constants/metadata.constants';
import { IResolverParameterMetadata } from '../interfaces';
import { Info } from './info.decorator';

const test = suite('@Info');

test('should load @Info metadata', async () => {
  const metadata: IResolverParameterMetadata = { method: 'method', type: 'info', index: 0, key: undefined };

  class ResolverTest {
    method(@Info() ctx: unknown): void {
      // noop.
    }
  }

  assert.equal(ResolverParametersMetadata.get(ResolverTest), [metadata]);
});

test.run();
