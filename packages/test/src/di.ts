import { Container, ProviderClass } from '@pequehq/di';

export const loadDI = (DI: Container, providers: ProviderClass[]): void => {
  for (const provider of providers) {
    DI.set(provider, provider.name);
  }
};
