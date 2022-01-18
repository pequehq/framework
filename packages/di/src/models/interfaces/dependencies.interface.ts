import { ProviderClass } from './types.interface';

export interface IDependency {
  provider: ProviderClass;
  identifier?: string;
}
