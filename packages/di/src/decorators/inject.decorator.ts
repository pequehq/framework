import { injectDecoratorMetadata } from './inject.decorator.metadata';

export function Inject(identifier: string): PropertyDecorator & ParameterDecorator {
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
