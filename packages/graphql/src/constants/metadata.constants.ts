import { ReflectionHelper } from '../helpers';
import {
  IResolverFieldMetadata,
  IResolverMutationMetadata,
  IResolverParameter,
  IResolverQueryMetadata,
  IResolverServiceMetadata,
} from '../interfaces';

export const ResolverServiceMetadata = new ReflectionHelper<IResolverServiceMetadata>('resolver:class');
export const ResolverFieldsMetadata = new ReflectionHelper<IResolverFieldMetadata[]>('resolver:fields');
export const ResolverQueriesMetadata = new ReflectionHelper<IResolverQueryMetadata[]>('resolver:queries');
export const ResolverMutationsMetadata = new ReflectionHelper<IResolverMutationMetadata[]>('resolver:mutations');
export const ResolverParametersMetadata = new ReflectionHelper<IResolverParameter[]>('resolver:parameters');
export const DesignTypeMetadata = new ReflectionHelper<any>('design:type');
