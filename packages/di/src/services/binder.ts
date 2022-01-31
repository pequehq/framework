import { ProviderClass } from '../types';

export class Binder {
  readonly #provider: ProviderClass;
  #targetProvider: ProviderClass;

  constructor(provider: ProviderClass) {
    this.#provider = provider;
    this.to(this.#provider);
  }

  to(targetProvider: ProviderClass): void {
    this.#targetProvider = targetProvider;
  }

  getTargetProvider(): ProviderClass {
    return this.#targetProvider;
  }
}
