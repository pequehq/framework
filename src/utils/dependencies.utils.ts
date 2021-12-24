import { ClassDeclaration, ProviderType } from '../models';
import { ControllerService } from '../models/dependency-injection/controller.service';
import { Injector } from '../models/dependency-injection/injector.service';
import { ModuleService } from '../models/dependency-injection/module.service';
import { Providers } from '../models/dependency-injection/providers';

export const getClassDependencies = (clazz: ClassDeclaration): unknown[] => {
  // Getting the params to be injected declared inside the constructor.
  const providers = Reflect.getMetadata('design:paramtypes', clazz) ?? [];
  return providers.map((provider) => Injector.resolve('injectable', provider.name));
};

export const loadInjectables = async (): Promise<void> => {
  // Load injectables.
  const injectables = Providers.getProvidersByType('injectable');
  for (const injectable of injectables) {
    await Injector.set('injectable', injectable.name, injectable.clazz, getClassDependencies(injectable.clazz));
  }

  // Load interceptors.
  const interceptors = Providers.getProvidersByType('interceptor');
  for (const interceptor of interceptors) {
    await Injector.set('interceptor', interceptor.name, interceptor.clazz, getClassDependencies(interceptor.clazz));
  }
};

export const destroyProviders = async (): Promise<void> => {
  for (const key of Providers.getProviderInstancesByType('injectable').keys()) {
    await Injector.unset('injectable', key);
  }

  for (const key of Providers.getProviderInstancesByType('interceptor').keys()) {
    await Injector.unset('interceptor', key);
  }
};

export const getAllInstances = (): unknown[] => {
  const controllers = Injector.resolve<ControllerService>('injectable', 'ControllerService');
  const modules = Injector.resolve<ModuleService>('injectable', 'ModuleService');

  return [
    ...controllers.getInstances(),
    ...modules.getInstances(),
    ...Providers.getProvidersByType('injectable').values(),
    ...Providers.getProvidersByType('interceptor').values()
  ];
};
