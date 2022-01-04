import { ClassDeclaration } from '../models';
import { Injector } from '../models/dependency-injection/injector.service';
import { Providers } from '../models/dependency-injection/provider.service';
import { LifeCycleManager } from '../services/life-cycle/life-cycle.service';

export const getClassDependencies = (clazz: ClassDeclaration): unknown[] => {
  // Getting the params to be injected declared inside the constructor.
  const providers = Reflect.getMetadata('design:paramtypes', clazz) ?? [];
  console.log('getClassDependencies > design:paramtypes', providers);
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

  // Load transformers.
  const transformers = Providers.getProvidersByType('transformer');
  for (const transformer of transformers) {
    await Injector.set('transformer', transformer.name, transformer.clazz, getClassDependencies(transformer.clazz));
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
