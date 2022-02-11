import { Container } from '@pequehq/di';

class DiHelper {
  #di: Container;

  register(container: Container): void {
    this.#di = container;
  }

  get(): Container {
    return this.#di;
  }
}

export const diHelper = new DiHelper();
