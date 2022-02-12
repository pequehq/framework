import { manageResolverParametersMetadata } from './utils/resolver-decorators.utils';

export function Ctx(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    manageResolverParametersMetadata({
      target,
      parameterIndex,
      propertyKey,
      paramType: 'ctx',
    });
  };
}
