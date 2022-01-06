import { TransportType } from '../models';
import { microserviceBuilder } from './utils/decorators';

export interface MicroserviceOptions {
  transport: TransportType;
  broker: string;
}

export const Microservice = (options: MicroserviceOptions): ClassDecorator => {
  return microserviceBuilder(options);
};
