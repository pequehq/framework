import { ProviderDefinition } from './provider-definition.interface';
import { ControllerClass, ModuleClass, ProviderClass, WebSocketClass } from './types';

export interface ModuleDefinition {
  modules?: ModuleClass[];
  providers?: ProviderClass[] | ProviderDefinition[];
  webSockets?: WebSocketClass[];
  controllers: ControllerClass[];
}
