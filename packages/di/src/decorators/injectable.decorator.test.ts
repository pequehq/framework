import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { Injectable } from './injectable.decorator';
import { injectableDecoratorMetadata } from './injectable.decorator.metadata';
import { InjectableMetadata } from './injectable.decorator.types';

const test = suite('Injectable decorator');

test('should set metadata for @Injectable class', () => {
  @Injectable({ to: 'OtherProvider' })
  class TestInjectable {}

  const metadata = injectableDecoratorMetadata.get(TestInjectable);

  const expectedMetadata: InjectableMetadata = { to: 'OtherProvider' };

  assert.equal(metadata, expectedMetadata);
});

test.run();
