import { ResolverFieldsMetadata } from '../constants/metadata.constants';
import { manageResolverParametersMetadata } from './utils/resolver-decorators.utils';

export function Parent(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    manageResolverParametersMetadata({
      target,
      parameterIndex,
      propertyKey,
      reflectionHelper: ResolverFieldsMetadata,
      paramType: 'parent',
    });
  };
}
