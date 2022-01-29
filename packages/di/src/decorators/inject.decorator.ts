import { injectDecoratorMetadata } from './inject.decorator.metadata';
import { InjectOptions } from './inject.decorator.types';

export function Inject({ identifier }: InjectOptions): PropertyDecorator & ParameterDecorator {
  return (target, propertyKey?, parameterIndex?): void => {
    const metadata = injectDecoratorMetadata.get(target) ?? [];

    metadata.push({
      identifier,
      propertyKey,
      parameterIndex,
    });

    injectDecoratorMetadata.set(metadata, target.constructor);
  };
}
