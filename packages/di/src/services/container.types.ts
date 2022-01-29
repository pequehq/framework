import { ProviderInstance } from '../types';

type ProviderHookHandler = (name: string, instance: ProviderInstance) => void;

interface ContainerOptions {
  onInit?: ProviderHookHandler;
  onDestroy?: ProviderHookHandler;
}

export type { ContainerOptions };
