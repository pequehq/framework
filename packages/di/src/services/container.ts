import { injectDecoratorMetadata } from '../decorators/inject.decorator.metadata';
import { ProviderNotFoundError } from '../errors/provider-not-found.error';
import { designParamTypesMetadata } from '../helpers/design-paramtypes.metadata';
import { Dependency, ProviderClass, ProviderInstance } from '../types';
import { Binder } from './binder';
import { ContainerOptions } from './container.types';

export class Container {
  #containers = new Map<string, ProviderInstance>();
  #bindings = new Map<string, Binder>();

  constructor(private options?: ContainerOptions) {}

  #resolve<T>(provider: ProviderClass, identifier: string): T {
    if (this.#containers.has(identifier)) {
      return this.#containers.get(identifier);
    }

    // 1. Collect params from constructor.
    // 2. Evaluate if a constructor param is decorated with @Inject and override it with the specified provider instead.
    const dependenciesConstructors = this.#arrangeDependencies(designParamTypesMetadata.get(provider) ?? []);
    this.#injectConstructorParams(provider, dependenciesConstructors);

    const injections = dependenciesConstructors.map((dependency) =>
      this.#resolve<unknown>(dependency.provider, dependency.identifier),
    );
    const instance = new provider(...injections) as T;

    // Define the @Inject decorated class properties get.
    this.#setInjectProviderProperties(instance);

    this.#containers.set(identifier, instance);

    this.options?.onInit?.(identifier, instance);
    return instance;
  }

  #arrangeDependencies(dependencies: ProviderClass[]): Dependency[] {
    return dependencies.map((dependency) => ({ identifier: dependency.name, provider: dependency }));
  }

  #injectConstructorParams(provider: ProviderClass, dependencies: Dependency[]): void {
    const injectConstructorParams = injectDecoratorMetadata.getParamsOnly(provider);
    for (let i = 0; i < injectConstructorParams.length; i++) {
      const binding = this.#getBinding(injectConstructorParams[i].identifier);
      dependencies[injectConstructorParams[i].parameterIndex].identifier = injectConstructorParams[i].identifier;
      dependencies[injectConstructorParams[i].parameterIndex].provider = binding.getProvider();
    }
  }

  #setInjectProviderProperties(provider: ProviderInstance): void {
    const injectProperties = injectDecoratorMetadata.getPropertiesOnly(Object.getPrototypeOf(provider).constructor);
    for (const { propertyKey, identifier } of injectProperties) {
      Object.defineProperty(provider, propertyKey, {
        get: () => this.get(identifier),
        enumerable: true,
        configurable: true,
      });
    }
  }

  #getBinding(identifier: string): Binder {
    const binding = this.#bindings.get(identifier);
    if (!binding) {
      throw new ProviderNotFoundError(identifier);
    }
    return binding;
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
    this.options?.onDestroy?.(identifier, this.get(identifier));
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
