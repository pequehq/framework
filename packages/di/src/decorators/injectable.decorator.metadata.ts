import { ReflectionMetadata } from '../helpers/reflection';
import { InjectableMetadata } from './injectable.decorator.types';

class InjectableDecoratorMetadata extends ReflectionMetadata<InjectableMetadata | undefined> {
  constructor() {
    super(Symbol('injectable'));
  }
}

export const injectableDecoratorMetadata = new InjectableDecoratorMetadata();
