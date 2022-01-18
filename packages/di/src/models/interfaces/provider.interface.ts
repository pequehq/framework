import { ProviderClass } from './types.interface';

export interface IProvider<T> {
  name: string;
  clazz: ProviderClass;
  type: T;
}
