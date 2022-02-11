import { ReflectionHelper } from '../../helpers';
import { IResolverMetadata, IResolverParameters, IResolverParamType } from '../../interfaces';

interface IResolverMetadataOptions {
  target: object;
  options?: unknown;
  propertyKey: symbol | string;
  reflectionHelper: ReflectionHelper<IResolverMetadata<unknown>[]>;
}

interface IResolverParametersMetadataOptions extends IResolverMetadataOptions {
  parameterIndex: number;
  paramType: IResolverParamType;
}

function getMetadata(
  target: object,
  reflectionHelper: ReflectionHelper<IResolverMetadata<unknown>[]>,
): IResolverMetadata<unknown>[] {
  const objectType = target.constructor;
  return reflectionHelper.get(objectType) ?? [];
}

export function manageResolverMetadata(options: IResolverMetadataOptions): void {
  const objectType = options.target.constructor;
  const elements = getMetadata(objectType, options.reflectionHelper) ?? [];

  elements.push({ method: options.propertyKey.toString(), options: options.options });
  options.reflectionHelper.set(elements, objectType);
}

export function manageResolverParametersMetadata(options: IResolverParametersMetadataOptions): void {
  const objectType = options.target.constructor;

  manageResolverMetadata({
    target: objectType,
    propertyKey: options.propertyKey,
    reflectionHelper: options.reflectionHelper,
  });

  const elements = getMetadata(objectType, options.reflectionHelper) ?? [];
  const index = elements.findIndex((metadata) => metadata.method === options.propertyKey);
  const params = elements[index].params ?? [];

  params.push({ index: options.parameterIndex, type: options.paramType });
  elements[index].params = params;
  options.reflectionHelper.set(elements, objectType);
}
