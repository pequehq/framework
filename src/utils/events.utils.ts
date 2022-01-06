import 'reflect-metadata';

import { MicroserviceOptions } from '../decorators';
import { Event, TransportType } from '../models';
import { DECORATORS } from '../models/constants/decorators';

export const buildEventName = (event: Event) => `${event.transport}.${event.event}`;

export const buildEventObject = (options: { event: string; transport?: TransportType; target: object }): Event => {
  const microserviceOptions: MicroserviceOptions = Reflect.getMetadata(
    DECORATORS.metadata.microservice.OPTIONS,
    options.target.constructor,
  );

  let transportType: TransportType = options.transport || 'internal';
  if (!options.transport) {
    if (microserviceOptions) {
      transportType = microserviceOptions.transport;
    }
  }
  return {
    event: options.event,
    transport: transportType,
  };
};
