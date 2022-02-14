import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ResolverParametersMetadata } from '../constants/metadata.constants';
import { IResolverParameterMetadata } from '../interfaces';
import { Parent } from './parent.decorator';

const test = suite('@Parent');

test('should load @Parent metadata', async () => {
  const metadata: IResolverParameterMetadata[] = [
    { method: 'methodOne', type: 'parent', index: 0, key: undefined },
    { method: 'methodTwo', type: 'parent', index: 0, key: undefined },
  ];

  class ResolverTest {
    methodOne(@Parent() parent: unknown): void {
      // noop.
    }

    methodTwo(@Parent() parent: unknown): void {
      // noop.
    }
  }

  assert.equal(ResolverParametersMetadata.get(ResolverTest), metadata);
});

test.run();
