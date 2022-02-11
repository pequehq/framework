import { ResolverQueriesMetadata } from '../constants/metadata.constants';
import { IQueryOptions } from '../interfaces';
import { manageResolverMetadata } from './utils/resolver-decorators.utils';

export function Query(options?: IQueryOptions): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    manageResolverMetadata({ target, propertyKey, reflectionHelper: ResolverQueriesMetadata, options });
  };
}
