import { Controllers, ControllerService } from '../models/dependency-injection/controller.service';
import { Injector } from '../models/dependency-injection/injector.service';
import { Modules, ModuleService } from '../models/dependency-injection/module.service';
import { Providers } from '../models/dependency-injection/provider.service';

export const getAllInstances = (): unknown[] => {
  // const controllers = Injector.resolve<ControllerService>('injectable', 'ControllerService');
  // const modules = Injector.resolve<ModuleService>('injectable', 'ModuleService');

  return [
    ...Controllers.getInstances(),
    ...Modules.getInstances(),
    ...Providers.getProviderInstancesByType('injectable').values(),
    ...Providers.getProviderInstancesByType('interceptor').values(),
  ];
};
