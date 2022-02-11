import { IResolvers } from '@graphql-tools/utils/Interfaces';
import { Injectable } from '@pequehq/di';

import { RESOLVERS } from '../../constants/graphql.constants';
import {
  ResolverFieldsMetadata,
  ResolverMutationsMetadata,
  ResolverParametersMetadata,
  ResolverQueriesMetadata,
} from '../../constants/metadata.constants';
import { diHelper } from '../../helpers';
import { IResolverParameter, IResolverParamType, IResolverServiceMetadata, Resolver } from '../../interfaces';

@Injectable()
export class ResolverService {
  #loadResolversInDI(): void {
    for (const resolver of RESOLVERS) {
      diHelper.get().set(resolver, resolver.name);
    }
  }

  #buildMetadata(resolver: Resolver): IResolverServiceMetadata {
    return {
      name: resolver.name,
      field: ResolverFieldsMetadata.get(resolver),
      mutation: ResolverMutationsMetadata.get(resolver),
      query: ResolverQueriesMetadata.get(resolver),
    };
  }

  #buildMethodWithParams(instance: InstanceType<Resolver>, method: string) {
    return (parent: unknown, args: unknown[], ctx: unknown, info: unknown) => {
      const params = ResolverParametersMetadata.get(Object.getPrototypeOf(instance).constructor);
      const methodArgs: unknown[] = [];
      const apolloParams: Record<IResolverParamType, (index: number) => void> = {
        parent: (index: number) => (methodArgs[index] = parent),
        ctx: (index: number) => (methodArgs[index] = ctx),
        args: (index: number) => (methodArgs[index] = args),
        info: (index: number) => (methodArgs[index] = info),
      };

      for (const param of params) {
        apolloParams[param.type](param.index);
      }

      return instance[method](...methodArgs);
    };
  }

  #buildInterface(instance: InstanceType<Resolver>, metadata: IResolverServiceMetadata): IResolvers {
    const resolver: IResolvers = {};

    for (const query of metadata.query) {
      const queryName = query.options?.name ?? query.method;
      Object.assign(resolver, { Query: { [queryName]: instance[query.method] } });
    }

    if (metadata.field) {
      for (const field of metadata.field) {
        const name = field.options?.name ?? field.method;
        Object.assign(resolver, {
          [field.options.type]: {
            ...resolver[field.options.type],
            [name]: this.#buildMethodWithParams(instance, field.method),
          },
        });
      }
    }

    return resolver;
  }

  loadResolvers(): IResolvers[] {
    const resolvers: IResolvers[] = [];

    this.#loadResolversInDI();

    for (const resolver of RESOLVERS) {
      const instance = diHelper.get().get(resolver.name);
      const metadata = this.#buildMetadata(resolver);
      resolvers.push(this.#buildInterface(instance, metadata));
    }

    return resolvers;
  }
}
