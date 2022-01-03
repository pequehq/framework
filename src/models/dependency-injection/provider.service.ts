import { ProviderClass, ProviderInstance, ProviderType } from '../interfaces/types';

interface ProviderInterface {
  name: string;
  clazz: ProviderClass;
}

interface InjectableInstance<TClass> {
  injectable: TClass;
}

interface InterceptorInstance<TClass> {
  interceptor: TClass;
}

interface TransformerInstance<TClass> {
  transformer: TClass;
}

interface MiddlewareInstance<TClass> {
  middleware: TClass;
}

export type ProviderInstances<TClass> = InjectableInstance<TClass> &
  InterceptorInstance<TClass> &
  TransformerInstance<TClass> &
  MiddlewareInstance<TClass>;

class ProviderService {
  private providerMaps: Record<ProviderType, Map<string, ProviderInstance>> = {
    injectable: new Map<string, ProviderInstance>(),
    interceptor: new Map<string, ProviderInstance>(),
    transformer: new Map<string, ProviderInstance>(),
    middleware: new Map<string, ProviderInstance>(),
  };

  private providerArrays: Record<ProviderType, ProviderInterface[]> = {
    injectable: [],
    interceptor: [],
    transformer: [],
    middleware: [],
  };

  private types = new Map<string, ProviderType[]>();

  addProvider(type: ProviderType, provider: ProviderInterface) {
    this.providerArrays[type].push(provider);

    const types = this.types.get(provider.name) || [];
    types.push(type);
    this.types.set(provider.name, types);
  }

  getProvidersByType(type: ProviderType): ProviderInterface[] {
    return this.providerArrays[type];
  }

  getProviderInstancesByType(type: ProviderType): Map<string, ProviderInstance> {
    return this.providerMaps[type];
  }

  hasProviderInstance(type: ProviderType, provider: string): boolean {
    return this.providerMaps[type].get(provider) !== undefined;
  }

  getProviderInstanceByType(type: ProviderType, provider: string): ProviderInstance {
    return this.providerMaps[type].get(provider);
  }

  getProviderInstances<TClass>(provider: string): ProviderInstances<TClass> {
    return {
      injectable: this.providerMaps.injectable.get(provider),
      interceptor: this.providerMaps.interceptor.get(provider),
      transformer: this.providerMaps.transformer.get(provider),
      middleware: this.providerMaps.middleware.get(provider),
    };
  }

  setProviderInstance(type: ProviderType, name: string, provider: ProviderInstance): void {
    this.providerMaps[type].set(name, provider);
  }

  deleteProviderInstance(type: ProviderType, provider: string): void {
    this.providerMaps[type].delete(provider);
  }

  getTypes(provider: string) {
    return this.types.get(provider);
  }

  unsetAll(): void {
    for (const key of Object.keys(this.providerArrays)) {
      this.providerArrays[key] = [];
    }

    for (const key of Object.keys(this.providerMaps)) {
      this.providerMaps[key] = new Map<string, ProviderInstance>();
    }
  }
}

export const Providers = new ProviderService();
