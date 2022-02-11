import { manageResolverParametersMetadata } from './utils/resolver-decorators.utils';

export function Args(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    manageResolverParametersMetadata({
      target,
      parameterIndex,
      propertyKey,
      paramType: 'args',
    });
  };
}
