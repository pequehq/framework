import { WebServerOptions } from '../models';
import { MicroserviceOptions, PequeMicroservice } from '../peque.microservice';
import { PequeWebServer } from '../peque.web-server';

export class PequeFactory {
  static createWebServer(options: WebServerOptions): PequeWebServer {
    return new PequeWebServer(options);
  }

  static createMicroservice(options: MicroserviceOptions): PequeMicroservice {
    return new PequeMicroservice(options);
  }
}
