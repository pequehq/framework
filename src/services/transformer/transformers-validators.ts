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
    switch (String(value).toLocaleLowerCase()) {
      case 'true':
      case '1':
        return true;
      case 'false':
      case '0':
        return false;
      default:
        throw new BadRequestException({ error: {}, message: 'Not a valid boolean' });
    }
  }
}
