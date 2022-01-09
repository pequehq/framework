import { Controllers } from '../models/dependency-injection/controller.service';
import { Modules } from '../models/dependency-injection/module.service';
import { Providers } from '../models/dependency-injection/provider.service';

export const getAllInstances = (): unknown[] => {
  return [
    ...Controllers.getInstances(),
    ...Modules.getInstances(),
    ...Providers.getProviderInstancesByType('injectable').values(),
    ...Providers.getProviderInstancesByType('interceptor').values(),
    ...Providers.getProviderInstancesByType('transformer').values(),
    ...Providers.getProviderInstancesByType('middleware').values(),
    ...Providers.getProviderInstancesByType('microservice').values(),
  ];
};
