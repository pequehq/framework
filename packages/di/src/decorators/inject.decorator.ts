import { InjectDecoratorMetadata } from './inject.decorator.metadata';

export function Inject(identifier: string): PropertyDecorator & ParameterDecorator {
  return (target, propertyKey?, parameterIndex?): void => {
    const metadata = InjectDecoratorMetadata.get(target) ?? [];

    metadata.push({
      identifier,
      propertyKey,
      parameterIndex,
    });

    InjectDecoratorMetadata.set(metadata, target.constructor);
  };
}
