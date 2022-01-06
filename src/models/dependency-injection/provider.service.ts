import { ProviderClass, ProviderInstance, ProviderType } from '../interfaces/types';

interface ProviderInterface {
  name: string;
  clazz: ProviderClass;
  type: ProviderType;
}

interface InjectableInstance {
  injectable: ProviderInstance;
}

interface InterceptorInstance {
  interceptor: ProviderInstance;
}

interface TransformerInstance {
  transformer: ProviderInstance;
}

interface MiddlewareInstance {
  middleware: ProviderInstance;
}

export type ProviderInstances = InjectableInstance & InterceptorInstance & TransformerInstance & MiddlewareInstance;

class ProviderService {
  #providerMaps: Record<ProviderType, Map<string, ProviderInstance>> = {
    injectable: new Map<string, ProviderInstance>(),
    interceptor: new Map<string, ProviderInstance>(),
    transformer: new Map<string, ProviderInstance>(),
    middleware: new Map<string, ProviderInstance>(),
  };

  #providerArray: ProviderInterface[] = [];

  addProvider(provider: ProviderInterface) {
    this.#providerArray.push(provider);
  }

  getProvidersByType(type: ProviderType): ProviderInterface[] {
    return this.#providerArray.filter((provider) => provider.type === type);
  }

  getProviderInstancesByType(type: ProviderType): Map<string, ProviderInstance> {
    return this.#providerMaps[type];
  }

  hasProviderInstance(type: ProviderType, provider: string): boolean {
    return this.#providerMaps[type].get(provider) !== undefined;
  }

  getProviderInstanceByType(type: ProviderType, provider: string): ProviderInstance {
    return this.#providerMaps[type].get(provider);
  }

  getProviderInstances(provider: string): ProviderInstances {
    return {
      injectable: this.#providerMaps.injectable.get(provider),
      interceptor: this.#providerMaps.interceptor.get(provider),
      transformer: this.#providerMaps.transformer.get(provider),
      middleware: this.#providerMaps.middleware.get(provider),
    };
  }

  getAllInstances() {
    return this.#providerMaps;
  }

  setProviderInstance(type: ProviderType, name: string, provider: ProviderInstance): void {
    this.#providerMaps[type].set(name, provider);
  }

  deleteProviderInstance(type: ProviderType, provider: string): void {
    this.#providerMaps[type].delete(provider);
  }

  unsetAll(): void {
    this.#providerArray = [];

    for (const key of Object.keys(this.#providerMaps)) {
      this.#providerMaps[key] = new Map<string, ProviderInstance>();
    }
  }
}

export const Providers = new ProviderService();
