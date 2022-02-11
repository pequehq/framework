import { IResolvers } from '@graphql-tools/utils/Interfaces';
import { Injectable } from '@pequehq/di';

import { RESOLVERS } from '../../constants/graphql.constants';
import {
  ResolverFieldsMetadata,
  ResolverMutationsMetadata,
  ResolverQueriesMetadata,
} from '../../constants/metadata.constants';
import { diHelper } from '../../helpers';
import { IResolverServiceMetadata, Resolver } from '../../interfaces';

@Injectable()
export class ResolverService {
  #loadResolversInDI(): void {
    for (const resolver of RESOLVERS) {
      diHelper.get().set(resolver, resolver.name);
    }
  }

  #buildResolverMetadata(resolver: Resolver): IResolverServiceMetadata {
    return {
      name: resolver.name,
      field: ResolverFieldsMetadata.get(resolver),
      mutation: ResolverMutationsMetadata.get(resolver),
      query: ResolverQueriesMetadata.get(resolver),
    };
  }

  #buildResolverInterface(instance: InstanceType<Resolver>, metadata: IResolverServiceMetadata): IResolvers {
    const resolver: IResolvers = {};

    for (const query of metadata.query) {
      const queryName = query.options?.name ?? query.method;
      Object.assign(resolver, { Query: { [queryName]: instance[query.method] } });
    }

    if (metadata.field) {
      for (const field of metadata.field) {
        const name = field.options?.name ?? field.method;
        Object.assign(resolver, { [field.options.type]: { [name]: instance[field.method] } });
      }
    }

    return resolver;
  }

  loadResolvers(): IResolvers[] {
    const resolvers: IResolvers[] = [];

    this.#loadResolversInDI();

    for (const resolver of RESOLVERS) {
      const instance = diHelper.get().get(resolver.name);
      const metadata = this.#buildResolverMetadata(resolver);
      resolvers.push(this.#buildResolverInterface(instance, metadata));
    }

    return resolvers;
  }
}
