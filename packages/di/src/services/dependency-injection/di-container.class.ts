import { IDiContainerOptions, ProviderClass, ProviderInstance, ProviderNotFoundException } from '../../models';
import { extractInjectParamsMetadata, extractInjectPropertiesMetadata } from '../../utils/inject.utils';
import { getMetadataDesignParamTypes, getMetadataInject } from '../reflection/reflection';
import { Binder } from './binder.class';

type IHookMethods = 'onInit' | 'onDestroy';

interface Dependency {
  identifier: string;
  dependency: ProviderClass;
}

export class DiContainer {
  #containers = new Map<string, ProviderInstance>();
  #bindings = new Map<string, Binder>();

  constructor(private options?: IDiContainerOptions) {}

  #triggerHook(instance: ProviderInstance, method: IHookMethods): void {
    this.options?.[method]?.(instance.constructor.name, instance);
  }

  #resolve<T>(provider: ProviderClass, identifier: string): T {
    if (this.#containers.has(identifier)) {
      return this.#containers.get(identifier);
    }

    // 1. Collect params from constructor.
    // 2. Evaluate if a constructor param is decorated with @Inject and override it with the specified provider instead.
    const dependenciesConstructors = this.#arrangeDependencies(getMetadataDesignParamTypes(provider));
    this.#injectConstructorParams(provider, dependenciesConstructors);

    const injections = dependenciesConstructors.map((dependency) =>
      this.#resolve<unknown>(dependency.dependency, dependency.identifier),
    );
    const instance = new provider(...injections) as T;

    // Define the @Inject decorated class properties get.
    this.#setInjectProviderProperties(instance);

    this.#containers.set(identifier, instance);

    this.#triggerHook(instance, 'onInit');
    return instance;
  }

  #arrangeDependencies(dependencies: ProviderClass[]): Dependency[] {
    return dependencies.map((dependency) => ({ identifier: dependency.name, dependency }));
  }

  #injectConstructorParams(provider: ProviderClass, dependencies: Dependency[]): void {
    const injectConstructorParams = extractInjectParamsMetadata(getMetadataInject(provider));
    for (let i = 0; i < injectConstructorParams.length; i++) {
      const binding = this.#getBinding(injectConstructorParams[i].identifier);
      dependencies[injectConstructorParams[i].parameterIndex].identifier = injectConstructorParams[i].identifier;
      dependencies[injectConstructorParams[i].parameterIndex].dependency = binding.getProvider();
    }
  }

  #setInjectProviderProperties(provider: ProviderInstance): void {
    const injectProperties = extractInjectPropertiesMetadata(
      getMetadataInject(Object.getPrototypeOf(provider).constructor),
    );
    for (const injectProperty of injectProperties) {
      Object.defineProperty(provider, injectProperty.propertyKey, {
        get: () => this.get(injectProperty.identifier),
        enumerable: true,
        configurable: true,
      });
    }
  }

  #getBinding(identifier: string): Binder {
    if (this.#bindings.has(identifier)) {
      return <Binder>this.#bindings.get(identifier);
    } else {
      throw new ProviderNotFoundException(identifier);
    }
  }

  get<T>(identifier: string): T {
    const binding = this.#getBinding(identifier);
    return this.#resolve(binding.getProvider(), identifier) as T;
  }

  set(provider: ProviderClass, identifier: string): Binder {
    const binding = new Binder(provider);
    this.#bindings.set(identifier, binding);
    return binding;
  }

  unset(identifier: string): void {
    this.#triggerHook(this.get(identifier), 'onDestroy');
    this.#bindings.delete(identifier);
    this.#containers.delete(identifier);
  }

  unsetAll(): void {
    for (const key of this.#containers.keys()) {
      this.unset(key);
    }

    this.#containers.clear();
    this.#bindings.clear();
  }
}
