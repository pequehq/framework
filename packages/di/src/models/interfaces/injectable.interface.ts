import { ProviderClass } from './types.interface';

export interface IInjectableOptions {
  store: string;
  to?: string;
}

export interface IProviderInject {
  clazz: ProviderClass;
  identifier: string;
  propertyKey: string;
  parameterIndex?: number;
  store?: string;
}
