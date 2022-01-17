import { IDiContainerOptions, ProviderClass, ProviderInstance, ProviderNotFoundException } from '../../models';
import { CONTAINER_INJECTABLE } from '../../models/constants/containers.constants';
import { getMetadataDesignParamTypes, getMetadataInjectable } from '../reflection/reflection';
import { Binder } from './binder.class';

type IContainerStore = {
  [key: string]: Map<string, ProviderInstance>;
};

type IInitDestroyMethods = 'onInit' | 'onDestroy';

export class DiContainer {
  #containers: IContainerStore = { injectable: new Map<string, ProviderInstance>() };
  #bindings: IContainerStore = { injectable: new Map<string, Binder>() };

  constructor(private options: IDiContainerOptions) {}

  #triggerInitDestroy(instance: ProviderInstance, method: IInitDestroyMethods): void {
    this.options[method](instance.constructor.name, instance);
  }

  #resolve<T>(provider: ProviderClass): T {
    const providerMetadata = getMetadataInjectable(provider);
    if (this.#containers[providerMetadata.store].has(provider.name)) {
      return this.#containers[providerMetadata.store].get(provider.name);
    }

    const dependencies = getMetadataDesignParamTypes(provider);
    const injections = dependencies.map((dependency: ProviderClass) => this.#resolve<unknown>(dependency));

    const instance = new provider(...injections) as T;
    this.#containers[providerMetadata.store].set(provider.name, instance);

    this.#triggerInitDestroy(instance, 'onInit');
    return instance;
  }

  #getBinding(identifier: string, store = CONTAINER_INJECTABLE): Binder {
    if (this.#bindings[store].has(identifier)) {
      return this.#bindings[store].get(identifier);
    } else {
      throw new ProviderNotFoundException(identifier, store);
    }
  }

  get<T>(identifier: string, store = CONTAINER_INJECTABLE): T {
    return this.#resolve(this.#getBinding(identifier, store).getProvider()) as T;
  }

  set(provider: ProviderClass, identifier: string): void {
    const binding = new Binder(provider);
    this.#bindings.injectable.set(identifier, binding);
  }

  unset(identifier: string, store = CONTAINER_INJECTABLE): void {
    this.#triggerInitDestroy(this.get(identifier, store), 'onDestroy');
    this.#bindings[store].delete(identifier);
    this.#containers[store].delete(identifier);
  }

  unsetAll(): void {
    for (const store of Object.keys(this.#containers)) {
      for (const key of this.#containers[store].keys()) {
        this.unset(key, store);
      }

      this.#containers[store].clear();
      this.#bindings[store].clear();
    }
  }
}
