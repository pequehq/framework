import { InjectDecoratorMetadata } from '../decorators/inject.decorator.metadata';
import { ProviderNotFoundError } from '../errors/provider-not-found.error';
import { DesignParamTypesMetadata } from '../helpers/design-param-types.metadata';
import { unique } from '../helpers/unique';
import { ProviderClass } from '../types';
import { Binder } from './binder';
import { ContainerOptions, Dependency, ProviderInstance } from './container.types';

type Identifier = string;

export class Container {
  #options: ContainerOptions | undefined;
  #instances = new Map<Identifier, ProviderInstance>();
  #bindings = new Map<Identifier, Binder>();

  constructor(options?: ContainerOptions) {
    this.#options = options;

    // Run set for providers specified in the options.
    if (this.#options?.providers?.length) {
      for (const provider of this.#options.providers) {
        this.set(provider, provider.name);
      }
    }
  }

  /**
   * Retrieve instance of class by its identifier.
   * @param identifier
   */
  get<T>(identifier: Identifier): T {
    return this.#resolve(this.#getBinding(identifier).getTargetProvider(), identifier);
  }

  /**
   * Allow the input class to be instantiated and resolved
   * using the dependency injection or via the container API.
   * @param provider
   * @param identifier
   */
  set(provider: ProviderClass, identifier: Identifier): Binder {
    const binding = new Binder(provider);
    this.#bindings.set(identifier, binding);
    return binding;
  }

  /**
   * Destroy binding and instance of the given identifier.
   * @param identifier
   */
  unset(identifier: Identifier): void {
    this.#options?.onDestroy?.(identifier, this.get(identifier));
    this.#bindings.delete(identifier);
    this.#instances.delete(identifier);
  }

  /**
   * Reset container to the initial state.
   */
  unsetAll(): void {
    for (const identifier of this.#instances.keys()) {
      this.unset(identifier);
    }
  }

  /**
   * Collect dependencies from input provider's constructor,
   * including dependencies decorated with @Inject.
   * @param provider
   * @private
   */
  #getConstructorDependencies(provider: ProviderClass): Dependency[] {
    // Collect dependencies from the constructor.
    const dependencies = unique(DesignParamTypesMetadata.get(provider)).map((provider) => ({
      identifier: provider.name,
      provider,
    }));

    // Evaluate if a constructor param is decorated with @Inject and override it with the specified provider instead.
    const injectDependencies = InjectDecoratorMetadata.getParamsOnly(provider);

    for (const { identifier, parameterIndex } of injectDependencies) {
      dependencies[parameterIndex] = {
        identifier,
        provider: this.#getBinding(identifier).getTargetProvider(),
      };
    }

    return dependencies;
  }

  /**
   * Evaluate if instance has properties decorated with @Inject(),
   * and override them with the resolved instance of the provider.
   * @param instance
   * @private
   */
  #setInjectProviderProperties(instance: ProviderInstance): void {
    const injectProperties = InjectDecoratorMetadata.getPropertiesOnly(Object.getPrototypeOf(instance).constructor);

    for (const { identifier, propertyKey } of injectProperties) {
      Object.defineProperty(instance, propertyKey, {
        get: () => this.get(identifier),
        enumerable: true,
        configurable: true,
      });
    }
  }

  /**
   * Inject and instantiate (if necessary) input provider's dependencies.
   * @param provider
   * @param identifier
   * @private
   */
  #resolve(provider: ProviderClass, identifier: Identifier): ProviderInstance {
    if (this.#instances.has(identifier)) {
      return this.#instances.get(identifier);
    }

    const constructorDependencies = this.#getConstructorDependencies(provider);

    const injections = constructorDependencies.map((dependency) => {
      return this.#resolve(dependency.provider, dependency.identifier);
    });

    const instance = new provider(...injections);

    this.#setInjectProviderProperties(instance);

    this.#instances.set(identifier, instance);
    this.#options?.onInit?.(identifier, instance);

    return instance;
  }

  /**
   * Retrieve binder instance of the given identifier or throw error if not found.
   * @param identifier
   * @private
   */
  #getBinding(identifier: Identifier): Binder {
    const binding = this.#bindings.get(identifier);

    if (!binding) {
      throw new ProviderNotFoundError(identifier);
    }

    return binding;
  }
}
