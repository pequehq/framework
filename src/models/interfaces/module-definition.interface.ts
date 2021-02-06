import { ProviderDefinition } from './provider-definition.interface';

export interface ModuleDefinition {
  modules?: any[];
  providers?: ProviderDefinition[] | any[];
  controllers: any[];
}
