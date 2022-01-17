import { ProviderClass } from './types.interface';

export interface IDependency {
  provider: ProviderClass;
  container?: string;
  identifier?: string;
}
