import { TransformerHandler } from '../../../src';
import { Transformer } from '../../../src/decorators/transformer';

@Transformer()
export class TestTransformer implements TransformerHandler {
  transform(value: unknown): unknown | Promise<unknown> {
    return `Adding some text: ${value}`;
  }
}
