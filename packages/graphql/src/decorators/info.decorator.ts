import { manageResolverParametersMetadata } from './utils/resolver-decorators.utils';

export function Info(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    manageResolverParametersMetadata({
      target,
      parameterIndex,
      propertyKey,
      paramType: 'info',
    });
  };
}
