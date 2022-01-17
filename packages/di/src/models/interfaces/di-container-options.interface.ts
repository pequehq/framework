import { ProviderInitHandler } from './types.interface';

export interface IDiContainerOptions {
  onInit: ProviderInitHandler;
  onDestroy: ProviderInitHandler;
}
