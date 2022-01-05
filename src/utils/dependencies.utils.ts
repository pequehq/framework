import 'reflect-metadata';

import { ClassDeclaration } from '../models';
import { Injector } from '../models/dependency-injection/injector.service';
import { Providers } from '../models/dependency-injection/provider.service';
import { LifeCycleManager } from '../services/life-cycle/life-cycle.service';

export const getClassDependencies = (clazz: ClassDeclaration): unknown[] => {
  // Getting the params to be injected declared inside the constructor.
  const providers = Reflect.getMetadata('design:paramtypes', clazz) ?? [];
  return providers.map((provider) => Injector.resolve('injectable', provider.name));
};

export const loadInjectables = async (): Promise<void> => {
  const providers = [
    ...Providers.getProvidersByType('injectable'),
    ...Providers.getProvidersByType('interceptor'),
    ...Providers.getProvidersByType('transformer'),
    ...Providers.getProvidersByType('middleware'),
  ];

  for (const provider of providers) {
    await Injector.set(provider.type, provider.name, provider.clazz, getClassDependencies(provider.clazz));
  }
};

export const destroyProviders = async (): Promise<void> => {
  for (const key of Providers.getProviderInstancesByType('injectable').keys()) {
    await LifeCycleManager.triggerProviderDestroy(key);
  }

  for (const key of Providers.getProviderInstancesByType('interceptor').keys()) {
    await LifeCycleManager.triggerProviderDestroy(key);
  }
};
