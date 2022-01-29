import { DependencyMap, ProviderClass } from '../types';

interface ProviderBinding {
  provider: ProviderClass;
  to: ProviderClass;
  dependencies: DependencyMap;
}

export type { ProviderBinding };
