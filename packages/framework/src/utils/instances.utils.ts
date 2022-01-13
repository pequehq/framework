import { Controllers } from '../models/dependency-injection/controller.service';
import { Injector } from '../models/dependency-injection/dependency-injection.service';
import { Modules } from '../models/dependency-injection/module.service';

export const getAllInstances = (): unknown[] => {
  return [
    ...Controllers.getInstances(),
    ...Modules.getInstances(),
    ...Injector.getProviderInstancesByType('injectable').values(),
    ...Injector.getProviderInstancesByType('interceptor').values(),
    ...Injector.getProviderInstancesByType('transformer').values(),
    ...Injector.getProviderInstancesByType('middleware').values(),
    ...Injector.getProviderInstancesByType('microservice').values(),
  ];
};
