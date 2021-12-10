import { Injector } from '../models/dependency-injection/injector.service';
import { Providers } from '../decorators/_index';
import { LifeCycleService } from '../services/life-cycle/life-cycle.service';
import { Controllers } from '../models/dependency-injection/controller.service';
import { Modules } from '../models/dependency-injection/module.service';

export const getClassDependencies = (clazz: any) => {
  // Getting the params to be injected declared inside the constructor.
  const providers = Reflect.getMetadata('design:paramtypes', clazz) || [];
  return providers.map(provider => Injector.resolve(provider.name));
};

export const loadInjectables = async () => {
  for (const provider of Providers) {
    await Injector.set(provider.name, provider.clazz, getClassDependencies(provider.clazz));
  }
}

export const destroyInjectables = async () => {
  for (const [key, value] of Injector.getProviders()) {
    await LifeCycleService.triggerProviderDestroy(value);
  }
}

export const getAllInstances = () => {
  const instances = [
    ...Controllers.getInstances(),
    ...Modules.getInstances(),
  ];
  Injector.getProviders().forEach(value => instances.push(value));
  return instances;
}
