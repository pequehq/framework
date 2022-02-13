import { ResolverParametersMetadata } from '../../constants/metadata.constants';
import { ReflectionHelper } from '../../helpers';
import { IResolverMetadata, IResolverParamType } from '../../interfaces';

interface IResolverMetadataOptions {
  target: object;
  options?: unknown;
  propertyKey: symbol | string;
  reflectionHelper: ReflectionHelper<IResolverMetadata<unknown>[]>;
}

interface IResolverParametersMetadataOptions {
  target: object;
  parameterIndex: number;
  paramType: IResolverParamType;
  propertyKey: symbol | string;
  paramKey?: string;
}

export function manageResolverMetadata(options: IResolverMetadataOptions): void {
  const objectType = options.target.constructor;
  const elements = options.reflectionHelper.get(objectType) ?? [];

  elements.push({ method: options.propertyKey.toString(), options: options.options });
  options.reflectionHelper.set(elements, objectType);
}

export function manageResolverParametersMetadata(options: IResolverParametersMetadataOptions): void {
  const objectType = options.target.constructor;

  const params = ResolverParametersMetadata.get(objectType) ?? [];
  params.push({
    index: options.parameterIndex,
    type: options.paramType,
    method: options.propertyKey.toString(),
    key: options.paramKey,
  });

  ResolverParametersMetadata.set(params, objectType);
}
