import { IInjectableOptions, IProviderInject, ProviderClass } from '../../models';
import { META_DESIGN_PARAMTYPES, META_INJECT, META_INJECTABLE } from '../../models/constants/metadata.constants';

function getReflectionMetadata<T>(metaKey: string, provider: ProviderClass): T {
  return Reflect.getMetadata(metaKey, provider) as T;
}

export function getMetadataInjectable(provider: ProviderClass): IInjectableOptions {
  return getReflectionMetadata<IInjectableOptions>(META_INJECTABLE, provider);
}

export function getMetadataInject(provider: ProviderClass): IProviderInject[] {
  return getReflectionMetadata<IProviderInject[]>(META_INJECT, provider);
}

export function getMetadataDesignParamTypes(provider: ProviderClass): ProviderClass[] {
  return getReflectionMetadata<ProviderClass[]>(META_DESIGN_PARAMTYPES, provider) || [];
}
