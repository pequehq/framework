import { MicroserviceOptions } from '../models';
import { microserviceBuilder } from './utils/decorators';

export const Microservice = (options: MicroserviceOptions): ClassDecorator => {
  return microserviceBuilder(options);
};
