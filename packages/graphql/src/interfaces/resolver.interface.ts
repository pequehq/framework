import { IResolverParamType } from './types';

export interface IResolverParameters {
  type: IResolverParamType;
  index: number;
}

export interface IResolverMetadata<TOptions> {
  method: string;
  options: TOptions;
  params?: IResolverParameters[];
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
export type IResolverFieldMetadata = IResolverMetadata<IFieldOptions>;

export interface IResolverServiceMetadata {
  name: string;
  query: IResolverQueryMetadata[];
  field?: IResolverFieldMetadata[];
  mutation?: IResolverMutationMetadata[];
}
