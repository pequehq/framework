import { TransformerClass, TransformerHandler } from '../../models';
import { Injector } from '../../models/dependency-injection/injector.service';

class TransformerService {
  async transform(value: unknown, transformer: TransformerClass): Promise<unknown> {
    if (!transformer) {
      return value;
    }
    const transformerProvider = Injector.resolve<TransformerHandler>('transformer', transformer.name);
    return await transformerProvider.transform(value);
  }
}

export const Transformers = new TransformerService();
