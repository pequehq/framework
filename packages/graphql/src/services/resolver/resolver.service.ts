import { IResolvers } from '@graphql-tools/utils/Interfaces';
import { Injectable } from '@pequehq/di';

import {
  ResolverFieldsMetadata,
  ResolverMutationsMetadata,
  ResolverParametersMetadata,
  ResolverQueriesMetadata,
} from '../../constants/metadata.constants';
import { IResolverParamType, IResolverServiceMetadata, ResolverDeclaration } from '../../interfaces';

@Injectable()
export class ResolverService {
  #buildMetadata(resolver: ResolverDeclaration): IResolverServiceMetadata {
    const prototype = Object.getPrototypeOf(resolver).constructor;
    return {
      name: prototype.name,
      field: ResolverFieldsMetadata.get(prototype),
      mutation: ResolverMutationsMetadata.get(prototype),
      query: ResolverQueriesMetadata.get(prototype),
    };
  }

  #buildMethodWithParams(instance: InstanceType<ResolverDeclaration>, method: string) {
    return (parent: unknown, args: never, ctx: never, info: unknown) => {
      const params = ResolverParametersMetadata.get(Object.getPrototypeOf(instance).constructor).filter(
        (param) => param.method === method,
      );
      const methodArgs: unknown[] = [];
      const apolloParams: Record<IResolverParamType, (index: number, key?: string) => void> = {
        parent: (index: number) => (methodArgs[index] = parent),
        ctx: (index: number, key?: string) => (key ? (methodArgs[index] = ctx[key]) : (methodArgs[index] = ctx)),
        args: (index: number, key?: string) => (key ? (methodArgs[index] = args[key]) : (methodArgs[index] = args)),
        info: (index: number) => (methodArgs[index] = info),
      };

      for (const param of params) {
        apolloParams[param.type](param.index, param.key);
      }

      return instance[method](...methodArgs);
    };
  }

  #buildInterface(instance: InstanceType<ResolverDeclaration>, metadata: IResolverServiceMetadata): IResolvers {
    const resolver: IResolvers = {};

    const objectAssign = (key: string, property: object) => {
      Object.assign(resolver, { [key]: { ...resolver[key], ...property } });
    };

    for (const query of metadata.query) {
      const name = query.options?.name ?? query.method;
      objectAssign('Query', { [name]: this.#buildMethodWithParams(instance, query.method) });
    }

    if (metadata.field) {
      for (const field of metadata.field) {
        const name = field.options?.name ?? field.method;
        objectAssign(field.options.type, { [name]: this.#buildMethodWithParams(instance, field.method) });
      }
    }

    if (metadata.mutation) {
      for (const mutation of metadata.mutation) {
        const name = mutation.options?.name ?? mutation.method;
        objectAssign('Mutation', { [name]: this.#buildMethodWithParams(instance, mutation.method) });
      }
    }

    return resolver;
  }

  loadResolvers(resolvers: InstanceType<ResolverDeclaration>[]): IResolvers[] {
    const apolloResolvers: IResolvers[] = [];

    for (const resolver of resolvers) {
      const metadata = this.#buildMetadata(resolver);
      apolloResolvers.push(this.#buildInterface(resolver, metadata));
    }

    return apolloResolvers;
  }
}
