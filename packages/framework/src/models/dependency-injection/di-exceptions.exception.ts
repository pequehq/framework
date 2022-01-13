export class ProviderNotFoundException extends Error {
  constructor(private provider: string) {
    super();
    this.#config();
  }

  #config() {
    this.message = `The requested dependency has not been found: ${this.provider}`;
  }
}
