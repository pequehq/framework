import { injectDecoratorMetadata } from '../decorators/inject.decorator.metadata';
import { InjectMetadata } from '../decorators/inject.decorator.types';
import { designParamTypesMetadata } from '../helpers/design-paramtypes.metadata';
import { Dependency, DependencyMap, ProviderClass } from '../types';

export class Scanner {
  #getInjectDecorated(provider: ProviderClass): InjectMetadata[] {
    return [...new Set<InjectMetadata>(injectDecoratorMetadata.get(provider))];
  }

  #getConstructorDependencies(provider: ProviderClass): ProviderClass[] {
    return [...new Set<ProviderClass>(designParamTypesMetadata.get(provider))];
  }

  scan(provider: ProviderClass): DependencyMap {
    const dependenciesMap = new Map<ProviderClass, Dependency[]>();
    const constructorDependencies = this.#getConstructorDependencies(provider);
    const injectConstructorParams = this.#getInjectDecorated(provider);

    const dependencies: Dependency[] = constructorDependencies.map((dependency, index) => {
      const injectConstructorParam = injectConstructorParams.find((param) => param.propertyKey === index.toString());
      return {
        provider: dependency,
        identifier: injectConstructorParam?.identifier ?? dependency.name,
      };
    });

    dependenciesMap.set(provider, dependencies);

    for (const dependency of constructorDependencies) {
      this.scan(dependency).forEach((value, key) => dependenciesMap.set(key, value));
    }

    return dependenciesMap;
  }
}
