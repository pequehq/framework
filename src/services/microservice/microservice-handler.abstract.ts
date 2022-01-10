import { MicroserviceOptions, OptionalTransportQueueItem } from '../../models';
import { DECORATORS } from '../../models/constants/decorators';
import { TransportQueue } from './transport-queue.service';

export abstract class MicroserviceHandler {
  abstract start(): void;

  #getMicroserviceOptions(): MicroserviceOptions {
    return Reflect.getMetadata(DECORATORS.metadata.microservice.OPTIONS, this.constructor) as MicroserviceOptions;
  }

  produce(event: OptionalTransportQueueItem): string {
    const options = this.#getMicroserviceOptions();

    return TransportQueue.sendItem({
      event: event.event,
      data: event.data,
      transport: event.transport || options.transport,
      broker: event.broker || options.broker,
      timestamp: event.timestamp,
    });
  }
}
