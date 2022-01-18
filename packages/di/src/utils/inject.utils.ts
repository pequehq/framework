import { IProviderInject } from '../models';

interface IProviderInjectProperty extends IProviderInject {
  propertyKey: string;
}

interface IProviderInjectParam extends IProviderInject {
  parameterIndex: number;
}

export function extractInjectPropertiesMetadata(metadata: IProviderInject[]): IProviderInjectProperty[] {
  return metadata.filter((data) => !data.parameterIndex) as IProviderInjectProperty[];
}

export function extractInjectParamsMetadata(metadata: IProviderInject[]): IProviderInjectParam[] {
  return metadata.filter((data) => !data.propertyKey) as IProviderInjectParam[];
}
