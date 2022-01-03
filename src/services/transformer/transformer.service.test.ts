import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { Transformer } from '../../decorators';
import { TransformerHandler } from '../../models';
import { Injector } from '../../models/dependency-injection/injector.service';
import { Providers } from '../../models/dependency-injection/provider.service';
import { loadInjectables } from '../../utils/dependencies.utils';

const test = suite('TransformerService');

test.before.each(() => {
  Providers.unsetAll();
});

test.after.each(() => {
  Providers.unsetAll();
});

test('should execute correctly a transformer', async () => {
  @Transformer()
  class TestTransformer implements TransformerHandler {
    transform(value: unknown): unknown | Promise<unknown> {
      return `Adding some text: ${value}`;
    }
  }

  await loadInjectables();

  const transformer = Injector.resolve<TransformerHandler>('transformer', 'TestTransformer');
  const result = transformer.transform('testValue');
  assert.is(result, 'Adding some text: testValue');
});

test.run();
