import { ProviderClass } from '../types';

type ProviderHookHandler = (name: string, instance: ProviderInstance) => void;

interface ContainerOptions {
  onInit?: ProviderHookHandler;
  onDestroy?: ProviderHookHandler;
}

interface Dependency {
  provider: ProviderClass;
  identifier: string;
}

type ProviderInstance = InstanceType<ProviderClass>;

export type { ContainerOptions, Dependency, ProviderInstance };
