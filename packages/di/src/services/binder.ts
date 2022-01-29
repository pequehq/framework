import { ProviderClass } from '../types';
import { ProviderBinding } from './binder.types';
import { Scanner } from './scanner';

export class Binder {
  #provider: ProviderClass;
  #scanner = new Scanner();
  #providerBinding: ProviderBinding;

  constructor(provider: ProviderClass) {
    this.#provider = provider;
    this.to(this.#provider);
  }

  getProvider(): ProviderClass {
    return this.#provider;
  }

  to(provider: ProviderClass): void {
    const dependencies = this.#scanner.scan(provider);
    this.#providerBinding = { provider: this.#provider, to: provider, dependencies };
    this.#provider = provider;
  }
}
