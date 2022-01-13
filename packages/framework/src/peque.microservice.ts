import { MicroserviceClass } from './models';
import { PequeBase } from './peque.base';
import { Microservices } from './services/microservice/microservice.service';

export interface MicroserviceOptions {
  services: MicroserviceClass[];
}

export class PequeMicroservice extends PequeBase {
  #started = false;
  #options: MicroserviceOptions;

  constructor(options: MicroserviceOptions) {
    super();

    this.#options = options;
  }

  async start(): Promise<void> {
    if (this.#started) {
      return;
    }

    await this.initialize();
    await Microservices.start();

    this.#started = true;
  }

  async stop(): Promise<void> {
    if (!this.#started) {
      return;
    }

    await this.teardown();

    this.#started = false;
  }

  protected override async onTermination(): Promise<void> {
    await this.stop();
  }
}
