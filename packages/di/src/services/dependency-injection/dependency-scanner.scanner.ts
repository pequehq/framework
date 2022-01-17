import 'reflect-metadata';

import { IDependency, IDependencyMap, ProviderClass } from '../../models';
import { IProviderInject } from '../../models';
import { CONTAINER_INJECTABLE } from '../../models/constants/containers.constants';
import { getMetadataDesignParamTypes, getMetadataInject } from '../reflection/reflection';

export class DependencyScanner {
  #getInjectDecorated(provider: ProviderClass): IProviderInject[] {
    return [...new Set<IProviderInject>(getMetadataInject(provider))];
  }

  scan(provider: ProviderClass): IDependencyMap {
    const dependenciesMap = new Map<ProviderClass, IDependency[]>();
    const constructorDependency = [...new Set<ProviderClass>(getMetadataDesignParamTypes(provider))];

    const dependencies: IDependency[] = constructorDependency.map((dependency) => {
      const injectDecoratedDep = this.#getInjectDecorated(provider).find(
        (injectDependency) => injectDependency.clazz === dependency,
      );
      return {
        provider: dependency,
        container: injectDecoratedDep ? injectDecoratedDep.store : CONTAINER_INJECTABLE,
        identifier: injectDecoratedDep ? injectDecoratedDep.identifier : dependency.name,
      };
    });

    dependenciesMap.set(provider, dependencies);

    for (const dependency of constructorDependency) {
      this.scan(dependency).forEach((value, key) => dependenciesMap.set(key, value));
    }

    return dependenciesMap;
  }
}
