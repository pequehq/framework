import 'reflect-metadata';

import { ResolverMutationsMetadata } from '../constants/metadata.constants';
import { IMutationOptions } from '../interfaces';
import { manageResolverMetadata } from './utils/resolver-decorators.utils';

export function Mutation(options?: IMutationOptions): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    manageResolverMetadata({ target, propertyKey, reflectionHelper: ResolverMutationsMetadata, options });
  };
}
