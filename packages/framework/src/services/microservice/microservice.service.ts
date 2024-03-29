import 'reflect-metadata';

import { MicroserviceOptions } from '../../models';
import { DECORATORS } from '../../models/constants/decorators';
import { NATIVE_SERVICES } from '../../models/constants/native-services';
import { Injector } from '../../models/dependency-injection/dependency-injection.service';
import { LoggerService } from '../logger/logger.service';
import { Gateways } from './microservice-gateway.service';

class MicroserviceService {
  async start(): Promise<void> {
    const logService = Injector.resolve<LoggerService>('injectable', NATIVE_SERVICES.LOGGER);

    const microservices = Injector.getProviderInstancesByType('microservice');
    for (const microservice of microservices.values()) {
      const microserviceOptions: MicroserviceOptions = Reflect.getMetadata(
        DECORATORS.metadata.microservice.OPTIONS,
        Object.getPrototypeOf(microservice).constructor,
      );
      Gateways.registerGateway(microserviceOptions);

      await microservice.start();
      logService.log({
        level: 'debug',
        data: `[microservice] [init] ${microservice.constructor.name}`,
      });
    }
  }
}

export const Microservices = new MicroserviceService();
