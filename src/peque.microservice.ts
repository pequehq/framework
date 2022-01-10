import { MicroserviceClass } from './models';
import { PequeBase } from './peque.base';
import { Microservices } from './services/microservice/microservice.service';

export interface MicroserviceOptions {
  services: MicroserviceClass[];
}

export class PequeMicroservice extends PequeBase {
  #options: MicroserviceOptions;

  constructor(options: MicroserviceOptions) {
    super();

    this.#options = options;
  }

  async start(): Promise<void> {
    await this.initialize();
    await Microservices.start();
  }

  async stop(): Promise<void> {
    await this.teardown();
  }
}
