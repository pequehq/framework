import 'reflect-metadata';

import { ClassDeclaration } from '../models';
import { Injector } from '../models/dependency-injection/injector.service';
import { Providers } from '../models/dependency-injection/provider.service';

export const getClassDependencies = (clazz: ClassDeclaration): unknown[] => {
  // Getting the params to be injected declared inside the constructor.
  const providers = Reflect.getMetadata('design:paramtypes', clazz) ?? [];
  return providers.map((provider) => Injector.resolve('injectable', provider.name));
};

export const loadProviders = async (): Promise<void> => {
  for (const provider of Providers.getAllProviders()) {
    await Injector.set(provider.type, provider.name, provider.clazz, getClassDependencies(provider.clazz));
  }
};
