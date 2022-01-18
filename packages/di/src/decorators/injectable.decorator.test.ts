import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { IInjectableOptions } from '../models';
import { getMetadataInjectable } from '../services/reflection/reflection';
import { Injectable } from './injectable.decorator';

const test = suite('Injectable decorator');

test('should set metadata for @Injectable class', () => {
  @Injectable({ to: 'OtherProvider' })
  class TestInjectable {}

  const testOptions: IInjectableOptions = { to: 'OtherProvider' };
  const injectableMetadata = getMetadataInjectable(TestInjectable);

  assert.is.not(injectableMetadata, undefined);
  assert.equal(injectableMetadata, testOptions);
});

test.run();
