import { ControllerService } from '../models/dependency-injection/controller.service';
import { Injector } from '../models/dependency-injection/injector.service';
import { ModuleService } from '../models/dependency-injection/module.service';
import { Providers } from '../models/dependency-injection/provider.service';

export const getAllInstances = (): unknown[] => {
  const controllers = Injector.resolve<ControllerService>('injectable', 'ControllerService');
  const modules = Injector.resolve<ModuleService>('injectable', 'ModuleService');

  return [
    ...controllers.getInstances(),
    ...modules.getInstances(),
    ...Providers.getProviderInstancesByType('injectable').values(),
    ...Providers.getProviderInstancesByType('interceptor').values(),
  ];
};
