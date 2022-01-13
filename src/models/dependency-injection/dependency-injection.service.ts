import { ProviderClass, ProviderInstance, ProviderType } from '../interfaces/types';
import { ProviderNotFoundException } from './di-exceptions.exception';

interface IProvider<T> {
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

type IInitDestroyMethods = 'onProviderInit' | 'onProviderDestroy';

export class DependencyInjectionService<TProviderType extends string> {
  #maps = {} as IProviderMaps<TProviderType>;
  #array: IProvider<TProviderType>[] = [];

  constructor(private typesArray: TProviderType[]) {
    for (const type of this.typesArray) {
      this.#maps[type] = new Map<string, ProviderInstance>();
    }
  }

  async #triggerInitDestroy(instance: ProviderInstance, method: IInitDestroyMethods): Promise<void> {
    if (instance && typeof instance[method] === 'function') {
      await instance[method]();
    }
  }

  add(provider: IProvider<TProviderType>): void {
    this.#array.push(provider);
  }

  getTypes(): TProviderType[] {
    return this.typesArray;
  }

  getProvidersByType(type: TProviderType): IProvider<TProviderType>[] {
    return this.#array.filter((provider) => provider.type === type);
  }

  getProviderInstancesByType(type: TProviderType): Map<string, ProviderInstance> {
    return this.#maps[type];
  }

  hasProviderInstance(type: TProviderType, provider: string): boolean {
    return this.#maps[type].get(provider) !== undefined;
  }

  getProviderInstanceByType(type: TProviderType, provider: string): ProviderInstance {
    return this.#maps[type].get(provider);
  }

  getProviderInstances(provider: string): IProviderInstances<TProviderType> {
    const result = {} as IProviderInstances<TProviderType>;
    for (const type of this.typesArray) {
      result[type] = this.#maps[type].get(provider);
    }
    return result;
  }

  getProviderByType(type: TProviderType, provider: string): IProvider<TProviderType> | undefined {
    return this.#array.find((prov) => prov.type === type && prov.name === provider);
  }

  getAllProviders(): IProvider<TProviderType>[] {
    const result: IProvider<TProviderType>[] = [];
    for (const type of this.typesArray) {
      result.push(...this.getProvidersByType(type));
    }
    return result;
  }

  setProviderInstance(type: TProviderType, name: string, provider: ProviderInstance): void {
    this.#maps[type].set(name, provider);
  }

  deleteProviderInstance(type: TProviderType, provider: string): void {
    this.#maps[type].delete(provider);
  }

  async unsetAll(): Promise<void> {
    this.#array = [];

    for (const key of Object.keys(this.#maps)) {
      const promises: unknown[] = [];
      for (const [map, instance] of this.#maps[key]) {
        promises.push(this.unset(key as TProviderType, instance.constructor.name));
      }
      await Promise.all(promises);
      this.#maps[key] = new Map<string, ProviderInstance>();
    }
  }

  resolve<TClass extends ProviderInstance>(type: TProviderType, provider: string): TClass {
    const matchedProvider = this.getProviderInstanceByType(type, provider) as TClass;
    if (!matchedProvider) {
      throw new ProviderNotFoundException(provider);
    }

    return matchedProvider;
  }

  async set(
    type: TProviderType,
    provider: string,
    target: ProviderClass,
    dependencies: ProviderInstance[] = [],
  ): Promise<void> {
    if (!this.hasProviderInstance(type, provider)) {
      const instance = new target(...dependencies);
      this.setProviderInstance(type, provider, instance);
      await this.#triggerInitDestroy(instance, 'onProviderInit');
      // @TODO add internal EE for lifecycle interception.
    }
  }

  async unset(type: TProviderType, provider: string): Promise<void> {
    await this.#triggerInitDestroy(this.getProviderInstanceByType(type, provider), 'onProviderDestroy');
    this.deleteProviderInstance(type, provider);
  }

  setNative(
    type: TProviderType,
    provider: string,
    target: ProviderClass | ProviderInstance,
    dependencies: ProviderInstance[] = [],
    createInstance = true,
  ): void {
    if (!this.hasProviderInstance(type, provider)) {
      const instance = createInstance ? new target(...dependencies) : target;
      this.setProviderInstance(type, provider, instance);
    }
  }
}

export const Injector = new DependencyInjectionService<ProviderType>([
  'transformer',
  'microservice',
  'injectable',
  'middleware',
  'interceptor',
]);
