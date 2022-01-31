import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { Inject } from './inject.decorator';
import { InjectDecoratorMetadata } from './inject.decorator.metadata';
import { InjectMetadata } from './inject.decorator.types';

const test = suite('Inject decorator');

test('should set metadata for @Inject property and parameter', () => {
  class TestInjectable {
    @Inject('PropertyIdentifier') injectProperty: unknown;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(@Inject('ParamIdentifier') injectParam: unknown) {
      // noop.
    }
  }

  const metadata = InjectDecoratorMetadata.get(TestInjectable);

  const expectedMetadata: InjectMetadata[] = [
    {
      identifier: 'PropertyIdentifier',
      propertyKey: 'injectProperty',
      parameterIndex: undefined,
    },
    {
      identifier: 'ParamIdentifier',
      propertyKey: undefined,
      parameterIndex: 0,
    },
  ];

  assert.equal(metadata, expectedMetadata);
});

test.run();
