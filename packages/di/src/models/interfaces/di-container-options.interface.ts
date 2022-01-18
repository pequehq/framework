import { ProviderHookHandler } from './types.interface';

export interface IDiContainerOptions {
  onInit?: ProviderHookHandler;
  onDestroy?: ProviderHookHandler;
}
