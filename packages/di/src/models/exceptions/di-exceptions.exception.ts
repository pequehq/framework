export class ProviderNotFoundException extends Error {
  constructor(private provider: string, private container: string) {
    super();
    this.#config();
  }

  #config() {
    this.message = `The requested dependency has not been found: ${this.container}/${this.provider}`;
  }
}
