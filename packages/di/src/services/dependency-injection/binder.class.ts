import { IDependencyMap, ProviderClass } from '../../models';
import { DependencyScanner } from './dependency-scanner.scanner';

interface IProviderBinding {
  provider: ProviderClass;
  to: ProviderClass;
  dependencies: IDependencyMap;
}

export class Binder {
  #dependencyScanner = new DependencyScanner();
  #providerBinding: IProviderBinding;

  constructor(private provider: ProviderClass) {
    this.to(this.provider);
  }

  getProvider(): ProviderClass {
    return this.provider;
  }

  to(provider: ProviderClass): void {
    const dependencies = this.#dependencyScanner.scan(provider);
    this.#providerBinding = { provider: this.provider, to: provider, dependencies };
  }

  toSelf(): void {
    this.to(this.provider);
  }
}
