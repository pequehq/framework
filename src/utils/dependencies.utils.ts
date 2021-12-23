import { Providers } from '../decorators';
import { ClassDeclaration } from '../models';
import { ControllerService } from '../models/dependency-injection/controller.service';
import { Injector } from '../models/dependency-injection/injector.service';
import { ModuleService } from '../models/dependency-injection/module.service';

export const getClassDependencies = (clazz: ClassDeclaration): unknown[] => {
  // Getting the params to be injected declared inside the constructor.
  const providers = Reflect.getMetadata('design:paramtypes', clazz) ?? [];
  return providers.map((provider) => Injector.resolve(provider.name));
};

export const loadInjectables = async (): Promise<void> => {
  for (const provider of Providers) {
    await Injector.set(provider.name, provider.clazz, getClassDependencies(provider.clazz));
  }
};

export const destroyInjectables = async (): Promise<void> => {
  for (const key of Injector.getProviders().keys()) {
    await Injector.unset(key);
  }
};

export const getAllInstances = (): unknown[] => {
  const controllers = Injector.resolve<ControllerService>('ControllerService');
  const modules = Injector.resolve<ModuleService>('ModuleService');

  return [...controllers.getInstances(), ...modules.getInstances(), ...Injector.getProviders().values()];
};
