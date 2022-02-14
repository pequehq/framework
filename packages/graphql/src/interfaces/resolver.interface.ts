import { IResolverParamType } from './types';

export interface IResolverParameterMetadata {
  method: string;
  type: IResolverParamType;
  index: number;
  key?: string;
}

export interface IResolverMetadata<TOptions> {
  method: string;
  options?: TOptions;
}

export interface IQueryOptions {
  name: string;
}

export interface IMutationOptions {
  name: string;
}

export interface IFieldOptions {
  name?: string;
  type: string;
}

export type IResolverQueryMetadata = IResolverMetadata<IQueryOptions>;
export type IResolverMutationMetadata = IResolverMetadata<IMutationOptions>;
export type IResolverFieldMetadata = Required<IResolverMetadata<IFieldOptions>>;

export interface IResolverServiceMetadata {
  name: string;
  query: IResolverQueryMetadata[];
  field?: IResolverFieldMetadata[];
  mutation?: IResolverMutationMetadata[];
}
