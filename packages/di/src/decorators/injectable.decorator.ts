import { injectableDecoratorMetadata } from './injectable.decorator.metadata';
import { InjectableOptions } from './injectable.decorator.types';

export function Injectable(options?: InjectableOptions): ClassDecorator {
  return (target): void => {
    injectableDecoratorMetadata.set(options, target);
  };
}
