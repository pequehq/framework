import { ProviderDefinition } from './provider-definition.interface';
import { ControllerClass, ModuleClass } from './types';

export interface ModuleDefinition {
  modules?: ModuleClass[];
  providers?: ProviderDefinition[];
  controllers: ControllerClass[];
}
