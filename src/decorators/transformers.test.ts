import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { TransformerHandler } from '../models';
import { Providers } from '../models/dependency-injection/provider.service';
import { Transformer } from './transformer';

const test = suite('Transformers');

test.after.each(() => {
  Providers.unsetAll();
});

test('should set a transformer provider', () => {
  @Transformer()
  class TestTransformer implements TransformerHandler {
    transform(value: unknown): unknown | Promise<unknown> {
      return `Adding some text: ${value}`;
    }
  }

  const transformers = Providers.getProvidersByType('transformer');

  assert.is(transformers.length, 1);
  assert.equal(transformers[0], {
    name: 'TestTransformer',
    clazz: TestTransformer,
  });
});

test.run();
