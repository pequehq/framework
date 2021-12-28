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

  assert.is(Providers.getProvidersByType('transformer').length, 1);
  assert.is(Providers.getProvidersByType('transformer')[0].name, 'TestTransformer');
});

test.run();
