import { ProviderDefinition } from './provider-definition.interface';
import { ControllerClass, ModuleClass, ProviderClass } from './types';

export interface ModuleDefinition {
  modules?: ModuleClass[];
  providers?: ProviderClass[] | ProviderDefinition[];
  controllers: ControllerClass[];
}
