import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { IProviderInject } from '../models';
import { getMetadataInject } from '../services/reflection/reflection';
import { Inject } from './inject.decorator';

const test = suite('Injectable decorator');

test('should set metadata for @Injectable class', () => {
  class TestInjectable {
    @Inject({ identifier: 'PropertyIdentifier' }) injectProperty: unknown;

    constructor(@Inject({ identifier: 'ParamIdentifier' }) injectParam: unknown) {
      // noop.
    }
  }

  const testOptions: IProviderInject[] = [
    { identifier: 'PropertyIdentifier', propertyKey: 'injectProperty', parameterIndex: undefined },
    { identifier: 'ParamIdentifier', propertyKey: undefined, parameterIndex: 0 },
  ];
  const injectMetadata = getMetadataInject(TestInjectable);

  assert.is.not(injectMetadata, undefined);
  assert.is(injectMetadata.length, 2);
  assert.equal(injectMetadata, testOptions);
});

test.run();
