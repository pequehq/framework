import { ProviderClass, ProviderInstance, ProviderType } from '../interfaces/types';

interface ProviderInterface<T> {
  name: string;
  clazz: ProviderClass;
  type: T;
}

type IProviderInstances<T extends string> = {
  [key in T]: ProviderInstance;
};

type IProviderMaps<T extends string> = {
  [key in T]: Map<string, ProviderInstance>;
};

class ProviderService<TProviderType extends string> {
  #providerMaps = {} as IProviderMaps<TProviderType>;
  #providerArray: ProviderInterface<TProviderType>[] = [];

  constructor(private typesArray: TProviderType[]) {
    for (const type of this.typesArray) {
      this.#providerMaps[type] = new Map<string, ProviderInstance>();
    }
  }

  addProvider(provider: ProviderInterface<TProviderType>): void {
    this.#providerArray.push(provider);
  }

  getProvidersByType(type: TProviderType): ProviderInterface<TProviderType>[] {
    return this.#providerArray.filter((provider) => provider.type === type);
  }

  getProviderInstancesByType(type: TProviderType): Map<string, ProviderInstance> {
    return this.#providerMaps[type];
  }

  hasProviderInstance<T>(type: T, provider: string): boolean {
    return this.#providerMaps[type as unknown as TProviderType].get(provider) !== undefined;
  }

  getProviderInstanceByType<T>(type: T, provider: string): ProviderInstance {
    return this.#providerMaps[type as unknown as TProviderType].get(provider);
  }

  getProviderInstances(provider: string): IProviderInstances<TProviderType> {
    const result = {} as IProviderInstances<TProviderType>;
    for (const type of this.typesArray) {
      result[type] = this.#providerMaps[type].get(provider);
    }
    return result;
  }

  getProviderByType(type: TProviderType, provider: string): ProviderInterface<TProviderType> | undefined {
    return this.#providerArray.find((prov) => prov.type === type && prov.name === provider);
  }

  getAllProviders(): ProviderInterface<TProviderType>[] {
    const result: ProviderInterface<TProviderType>[] = [];
    for (const type of this.typesArray) {
      result.push(...this.getProvidersByType(type));
    }
    return result;
  }

  setProviderInstance<T>(type: T, name: string, provider: ProviderInstance): void {
    this.#providerMaps[type as unknown as TProviderType].set(name, provider);
  }

  deleteProviderInstance<T>(type: T, provider: string): void {
    this.#providerMaps[type as unknown as TProviderType].delete(provider);
  }

  getTypes(provider: string) {
    return this.#providerArray.filter((prov) => prov.name === provider);
  }

  unsetAll(): void {
    this.#providerArray = [];

    for (const key of Object.keys(this.#providerMaps)) {
      this.#providerMaps[key] = new Map<string, ProviderInstance>();
    }
  }
}

export const Providers = new ProviderService<ProviderType>([
  'transformer',
  'microservice',
  'injectable',
  'middleware',
  'interceptor',
]);
