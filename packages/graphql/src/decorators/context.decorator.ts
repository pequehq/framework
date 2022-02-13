import { manageResolverParametersMetadata } from './utils/resolver-decorators.utils';

export function Context(key?: string): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    manageResolverParametersMetadata({
      target,
      parameterIndex,
      propertyKey,
      paramType: 'ctx',
      paramKey: key,
    });
  };
}
