import { manageResolverParametersMetadata } from './utils/resolver-decorators.utils';

export function Parent(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    manageResolverParametersMetadata({
      target,
      parameterIndex,
      propertyKey,
      paramType: 'parent',
    });
  };
}
