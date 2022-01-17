import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { Injectable } from '../../decorators';
import { IDependency, IDependencyMap, ProviderClass } from '../../models';
import { CONTAINER_INJECTABLE } from '../../models/constants/containers.constants';
import { DependencyScanner } from './dependency-scanner.scanner';

const test = suite('Dependency Scanner');

test('should scan injectable classes dependencies', () => {
  @Injectable()
  class ProviderOne {}

  @Injectable()
  class ProviderTwo {
    constructor(private providerOne: ProviderOne) {}
  }

  @Injectable()
  class ProviderThree {
    constructor(private providerTwo: ProviderTwo, private providerOne: ProviderOne) {}
  }

  @Injectable()
  class ProviderFour {
    constructor(private providerTwo: ProviderTwo, private providerThree: ProviderThree) {}
  }

  const testDependenciesMap: IDependencyMap = new Map<ProviderClass, IDependency[]>();
  testDependenciesMap.set(ProviderOne, []);
  testDependenciesMap.set(ProviderTwo, [
    { provider: ProviderOne, container: CONTAINER_INJECTABLE, identifier: ProviderOne.name },
  ]);
  testDependenciesMap.set(ProviderThree, [
    {
      provider: ProviderTwo,
      container: CONTAINER_INJECTABLE,
      identifier: ProviderTwo.name,
    },
    {
      provider: ProviderOne,
      container: CONTAINER_INJECTABLE,
      identifier: ProviderOne.name,
    },
  ]);
  testDependenciesMap.set(ProviderFour, [
    {
      provider: ProviderTwo,
      container: CONTAINER_INJECTABLE,
      identifier: ProviderTwo.name,
    },
    {
      provider: ProviderThree,
      container: CONTAINER_INJECTABLE,
      identifier: ProviderThree.name,
    },
  ]);

  const scanner = new DependencyScanner();
  const dependencies = scanner.scan(ProviderFour);
  assert.equal(dependencies, testDependenciesMap);
});

test.run();
