import { MicroserviceTransportType } from '../models';
import { microserviceBuilder } from './utils/decorators';

export interface MicroserviceOptions {
  transport: MicroserviceTransportType;
  broker: string;
}

export const Microservice = (options: MicroserviceOptions): ClassDecorator => {
  return microserviceBuilder(options);
};
