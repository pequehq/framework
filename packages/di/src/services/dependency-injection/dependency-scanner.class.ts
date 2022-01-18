import 'reflect-metadata';

import { IDependency, IDependencyMap, ProviderClass } from '../../models';
import { IProviderInject } from '../../models';
import { getMetadataDesignParamTypes, getMetadataInject } from '../reflection/reflection';

export class DependencyScanner {
  #getInjectDecorated(provider: ProviderClass): IProviderInject[] {
    return [...new Set<IProviderInject>(getMetadataInject(provider))];
  }

  scan(provider: ProviderClass): IDependencyMap {
    const dependenciesMap = new Map<ProviderClass, IDependency[]>();
    const constructorDependency = [...new Set<ProviderClass>(getMetadataDesignParamTypes(provider))];

    const injectConstructorParams = this.#getInjectDecorated(provider);
    const dependencies: IDependency[] = constructorDependency.map((dependency, index) => {
      const injectConstructorParam = injectConstructorParams.find((param) => param.propertyKey === index.toString());
      return {
        provider: dependency,
        identifier: injectConstructorParam ? injectConstructorParam.identifier : dependency.name,
      };
    });

    dependenciesMap.set(provider, dependencies);

    for (const dependency of constructorDependency) {
      this.scan(dependency).forEach((value, key) => dependenciesMap.set(key, value));
    }

    return dependenciesMap;
  }
}
