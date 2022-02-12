import { ReflectionHelper } from '../helpers';
import {
  IResolverFieldMetadata,
  IResolverMutationMetadata,
  IResolverParameterMetadata,
  IResolverQueryMetadata,
} from '../interfaces';

export const ResolverFieldsMetadata = new ReflectionHelper<IResolverFieldMetadata[]>('resolver:fields');
export const ResolverQueriesMetadata = new ReflectionHelper<IResolverQueryMetadata[]>('resolver:queries');
export const ResolverMutationsMetadata = new ReflectionHelper<IResolverMutationMetadata[]>('resolver:mutations');
export const ResolverParametersMetadata = new ReflectionHelper<IResolverParameterMetadata[]>('resolver:parameters');
