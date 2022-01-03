import { isNumber } from 'util';

import { Transformer } from '../../decorators';
import { BadRequestException, TransformerHandler } from '../../models';

@Transformer()
export class ToString implements TransformerHandler {
  transform(value: unknown): string | Promise<string> {
    return String(value);
  }
}

@Transformer()
export class ToNumber implements TransformerHandler {
  transform(value: unknown): number | Promise<number> {
    if (!isNaN(Number(value))) {
      return Number(value);
    } else {
      throw new BadRequestException({ error: {}, message: 'Not a number' });
    }
  }
}

@Transformer()
export class ToBoolean implements TransformerHandler {
  transform(value: unknown): boolean | Promise<boolean> {
    if (typeof Boolean(value) === 'boolean') {
      return Boolean(value);
    } else {
      throw new BadRequestException({ error: {}, message: 'Not a valid boolean' });
    }
  }
}
