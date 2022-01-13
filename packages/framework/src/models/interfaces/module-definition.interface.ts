import { ProviderDefinition } from './provider-definition.interface';
import { ControllerClass, InterceptorClass, ModuleClass, ProviderClass, WebSocketClass } from './types';

export interface ModuleDefinition {
  modules?: ModuleClass[];
  providers?: ProviderClass[] | ProviderDefinition[];
  webSockets?: WebSocketClass[];
  interceptors?: InterceptorClass[];
  controllers: ControllerClass[];
}
