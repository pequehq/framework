import { ProviderClass, ProviderInstance, ProviderType } from '../interfaces/types';

interface ProviderInterface {
  name: string;
  clazz: ProviderClass;
  type: ProviderType;
}

export interface ProviderInstances {
  injectable: ProviderInstance;
  interceptor: ProviderInstance;
  transformer: ProviderInstance;
  middleware: ProviderInstance;
  microservice: ProviderInstance;
}

class ProviderService {
  private providerMaps: Record<ProviderType, Map<string, ProviderInstance>> = {
    injectable: new Map<string, ProviderInstance>(),
    interceptor: new Map<string, ProviderInstance>(),
    transformer: new Map<string, ProviderInstance>(),
    middleware: new Map<string, ProviderInstance>(),
    microservice: new Map<string, ProviderInstance>(),
  };

  private providerArray: ProviderInterface[] = [];

  addProvider(provider: ProviderInterface) {
    this.providerArray.push(provider);
  }

  getProvidersByType(type: ProviderType): ProviderInterface[] {
    return this.providerArray.filter((provider) => provider.type === type);
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

  getProviderInstances(provider: string): ProviderInstances {
    return {
      injectable: this.providerMaps.injectable.get(provider),
      interceptor: this.providerMaps.interceptor.get(provider),
      transformer: this.providerMaps.transformer.get(provider),
      middleware: this.providerMaps.middleware.get(provider),
      microservice: this.providerMaps.microservice.get(provider),
    };
  }

  getProviderByType(type: ProviderType, provider: string): ProviderInterface {
    return this.providerArray.find((prov) => prov.type === type && prov.name === provider);
  }

  getAllProviders(): ProviderInterface[] {
    return [
      ...this.getProvidersByType('injectable'),
      ...this.getProvidersByType('interceptor'),
      ...this.getProvidersByType('transformer'),
      ...this.getProvidersByType('middleware'),
      ...this.getProvidersByType('microservice'),
    ];
  }

  setProviderInstance(type: ProviderType, name: string, provider: ProviderInstance): void {
    this.providerMaps[type].set(name, provider);
  }

  deleteProviderInstance(type: ProviderType, provider: string): void {
    this.providerMaps[type].delete(provider);
  }

  getTypes(provider: string) {
    return this.providerArray.filter((prov) => prov.name === provider);
  }

  unsetAll(): void {
    this.providerArray = [];

    for (const key of Object.keys(this.providerMaps)) {
      this.providerMaps[key] = new Map<string, ProviderInstance>();
    }
  }
}

export const Providers = new ProviderService();
