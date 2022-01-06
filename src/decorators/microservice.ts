import { ExternalTransportType } from '../models';
import { microserviceBuilder } from './utils/decorators';

export interface MicroserviceOptions {
  transport: ExternalTransportType;
  broker: string;
}

export const Microservice = (options: MicroserviceOptions): ClassDecorator => {
  return microserviceBuilder(options);
};
