import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { Transformer } from '../../decorators';
import { TransformerHandler } from '../../models';
import { Injector } from '../../models/dependency-injection/dependency-injection.service';
import { loadProviders } from '../../utils/dependencies.utils';

const test = suite('Transformer Service');

test.after.each(async () => {
  await Injector.unsetAll();
});

test('should execute correctly a transformer', async () => {
  @Transformer()
  class TestTransformer implements TransformerHandler {
    transform(value: unknown): unknown | Promise<unknown> {
      return `Adding some text: ${value}`;
    }
  }

  await loadProviders();
  const transformer = Injector.resolve<TransformerHandler>('transformer', 'TestTransformer');
  const result = transformer.transform('testValue');
  assert.is(result, 'Adding some text: testValue');
});

test.run();
