import { Transformer, TransformerHandler } from '../../../dist';

@Transformer()
export class TestTransformer implements TransformerHandler {
  transform(value: unknown): unknown | Promise<unknown> {
    return `Adding some text: ${value}`;
  }
}
