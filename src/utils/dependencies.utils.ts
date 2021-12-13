import { Providers } from '../decorators/_index';
import { ControllerService } from '../models/dependency-injection/controller.service';
import { Injector } from '../models/dependency-injection/injector.service';
import { ModuleService } from '../models/dependency-injection/module.service';
import { LifeCycleService } from '../services/life-cycle/life-cycle.service';

export const getClassDependencies = (clazz: any) => {
  // Getting the params to be injected declared inside the constructor.
  const providers = Reflect.getMetadata('design:paramtypes', clazz) || [];
  return providers.map((provider) => Injector.resolve(provider.name));
};

export const loadInjectables = async () => {
  for (const provider of Providers) {
    await Injector.set(provider.name, provider.clazz, getClassDependencies(provider.clazz));
  }
};

export const destroyInjectables = async () => {
  for (const [, value] of Injector.getProviders()) {
    await LifeCycleService.triggerProviderDestroy(value);
  }
};

export const getAllInstances = () => {
  const controllers = Injector.resolve<ControllerService>('ControllerService');
  const modules = Injector.resolve<ModuleService>('ModuleService');
  const instances = [...controllers.getInstances(), ...modules.getInstances()];
  Injector.getProviders().forEach((value) => instances.push(value));
  return instances;
};
