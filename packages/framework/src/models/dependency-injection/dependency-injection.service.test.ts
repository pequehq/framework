import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { getClassDependencies } from '../../utils/dependencies.utils';
import { OnProviderDestroy, OnProviderInit } from '../interfaces/life-cycle.interface';
import { DependencyInjectionService } from './dependency-injection.service';
import { ProviderNotFoundException } from './di-exceptions.exception';

const test = suite('Dependency Injection Service');

type TestProviderTypes = 'injectable';
const Injector = new DependencyInjectionService<TestProviderTypes>(['injectable']);

test.before.each((context) => {
  // @TODO
  class TestProviderOne implements OnProviderInit, OnProviderDestroy {
    testMethod(): string {
      return 'provider one';
    }

    onProviderInit() {
      // noop.
    }

    onProviderDestroy() {
      // noop.
    }
  }

  context.sandbox = sinon.createSandbox();
  context.stubs = {
    providerOneOnInit: context.sandbox.spy(TestProviderOne.prototype, 'onProviderInit'),
    providerOneOnDestroy: context.sandbox.spy(TestProviderOne.prototype, 'onProviderDestroy'),
  };
  context.providers = {
    providerOne: TestProviderOne,
  };
});

test.after.each(async (context) => {
  await Injector.unsetAll();
  context.sandbox.restore();
});

test('should add a provider', (context) => {
  Injector.add({ name: context.providers.providerOne.name, type: 'injectable', clazz: context.providers.providerOne });

  assert.is.not(Injector.getProviderByType('injectable', context.providers.providerOne.name), undefined);
  assert.is(Injector.getProvidersByType('injectable').length, 1);
});

test('should create and destroy an instance of a provider', async (context) => {
  Injector.add({ name: context.providers.providerOne.name, type: 'injectable', clazz: context.providers.providerOne });
  for (const provider of Injector.getAllProviders()) {
    await Injector.set(provider.type, provider.name, provider.clazz, getClassDependencies(provider.clazz));
  }
  const typeInstances = Injector.getProviderInstancesByType('injectable');
  const testProviderOne = Injector.resolve<any>('injectable', context.providers.providerOne.name);
  const providerInstances = {
    injectable: testProviderOne,
  };

  assert.is(context.stubs.providerOneOnInit.callCount, 1);
  assert.equal(Injector.getProviderInstances(context.providers.providerOne.name), providerInstances);
  assert.is(typeInstances.size, 1);
  assert.is(typeInstances.get(context.providers.providerOne.name), testProviderOne);
  assert.is(testProviderOne.testMethod(), 'provider one');

  await Injector.unset('injectable', context.providers.providerOne.name);
  assert.is(context.stubs.providerOneOnDestroy.callCount, 1);
});

test('should throw an error if a provider is not resolved', () => {
  assert.throws(
    () => Injector.resolve<any>('injectable', 'NotExistingProvider'),
    (err) => err instanceof ProviderNotFoundException,
  );
});

test('should get the types set on the constructor', () => {
  assert.equal(Injector.getTypes(), ['injectable']);
});

test.run();
