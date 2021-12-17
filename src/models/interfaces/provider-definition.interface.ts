import { ProviderClass } from './types';

export interface ProviderDefinition {
  useClass: ProviderClass | string;
  provider: ProviderClass;
}
