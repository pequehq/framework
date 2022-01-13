import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { TransformerHandler } from '../models';
import { Injector } from '../models/dependency-injection/dependency-injection.service';
import { Transformer } from './transformer';

const test = suite('Transformers');

test.after.each(async () => {
  await Injector.unsetAll();
});

test('should set a transformer provider', () => {
  @Transformer()
  class TestTransformer implements TransformerHandler {
    transform(value: unknown): unknown | Promise<unknown> {
      return `Adding some text: ${value}`;
    }
  }

  const transformers = Injector.getProvidersByType('transformer');

  assert.is(transformers.length, 1);
  assert.equal(transformers[0], {
    name: 'TestTransformer',
    clazz: TestTransformer,
    type: 'transformer',
  });
});

test.run();
