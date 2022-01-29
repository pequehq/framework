import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { Injectable } from '../decorators/injectable.decorator';
import { Dependency, DependencyMap, ProviderClass } from '../types';
import { Scanner } from './scanner';

const test = suite('Scanner');

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

  const testDependenciesMap: DependencyMap = new Map<ProviderClass, Dependency[]>();
  testDependenciesMap.set(ProviderOne, []);
  testDependenciesMap.set(ProviderTwo, [{ provider: ProviderOne, identifier: ProviderOne.name }]);
  testDependenciesMap.set(ProviderThree, [
    {
      provider: ProviderTwo,
      identifier: ProviderTwo.name,
    },
    {
      provider: ProviderOne,
      identifier: ProviderOne.name,
    },
  ]);
  testDependenciesMap.set(ProviderFour, [
    {
      provider: ProviderTwo,
      identifier: ProviderTwo.name,
    },
    {
      provider: ProviderThree,
      identifier: ProviderThree.name,
    },
  ]);

  const scanner = new Scanner();
  const dependencies = scanner.scan(ProviderFour);
  assert.equal(dependencies, testDependenciesMap);
});

test.run();
