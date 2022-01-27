import 'reflect-metadata';

import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { Inject, Injectable } from '../../decorators';
import { ProviderNotFoundException } from '../../models';
import { DiContainer } from './di-container.class';

const test = suite('Dependency Injection Container');

test.before.each((context) => {
  @Injectable()
  class ProviderOne {
    testMethod() {
      return 'ProviderOne.testMethod';
    }
  }

  @Injectable()
  class ProviderTwo {
    constructor(private providerOne: ProviderOne) {}
    testMethod() {
      return 'ProviderTwo.testMethod';
    }
  }

  @Injectable()
  class ProviderThree {
    constructor(private providerTwo: ProviderTwo, private providerOne: ProviderOne) {}
  }

  @Injectable()
  class ProviderFour {
    @Inject({ identifier: 'ProviderOne' })
    injectPropertyOne: ProviderOne;

    constructor(
      private providerTwo: ProviderTwo,
      private providerThree: ProviderThree,
      @Inject({ identifier: 'ProviderFive' }) private injectParamProvider: ProviderOne,
    ) {}
    testMethod() {
      return `ProviderFour.testMethod ${this.providerTwo.testMethod()} ${this.injectParamProvider.testMethod()}`;
    }
  }

  @Injectable()
  class ProviderFive {
    testMethod() {
      return 'ProviderFive.testMethod';
    }
  }

  context.sandbox = sinon.createSandbox();

  context.providers = {
    providerOne: ProviderOne,
    providerTwo: ProviderTwo,
    providerThree: ProviderThree,
    providerFour: ProviderFour,
    providerFive: ProviderFive,
  };

  const onInit = context.sandbox.fake();
  const onDestroy = context.sandbox.fake();

  context.sandbox.stubs = { onInit, onDestroy };

  context.container = new DiContainer({ onInit, onDestroy });

  context.container.set(context.providers.providerOne, context.providers.providerOne.name);
  context.container.set(context.providers.providerTwo, context.providers.providerTwo.name);
  context.container.set(context.providers.providerThree, context.providers.providerThree.name);
  context.container.set(context.providers.providerFour, context.providers.providerFour.name);
  context.container.set(context.providers.providerFive, context.providers.providerFive.name);
});

test.after.each((context) => {
  context.sandbox.restore();
  context.container.unsetAll();
});

test('should set providers with TO syntax', (context) => {
  @Injectable()
  class ProviderBind {}

  @Injectable()
  class ProviderToBind {}

  @Injectable()
  class TestProviderToBind {
    constructor(providerToBind: ProviderBind) {
      // noop.
    }
  }

  context.container.set(ProviderBind, ProviderBind.name).to(ProviderToBind);
  context.container.set(TestProviderToBind, TestProviderToBind.name);

  assert.instance(context.container.get(ProviderBind.name), ProviderToBind);
  assert.instance(context.container.get(TestProviderToBind.name), TestProviderToBind);
  assert.instance(context.container.get(TestProviderToBind.name).providerToBind, ProviderToBind);
});

test('should set providers', (context) => {
  const providerFour = context.container.get(context.providers.providerFour.name);
  assert.instance(context.container.get(context.providers.providerOne.name), context.providers.providerOne);
  assert.instance(context.container.get(context.providers.providerTwo.name), context.providers.providerTwo);
  assert.instance(context.container.get(context.providers.providerThree.name), context.providers.providerThree);
  assert.instance(providerFour, context.providers.providerFour);
  assert.is(providerFour.testMethod(), 'ProviderFour.testMethod ProviderTwo.testMethod ProviderFive.testMethod');
  assert.is(providerFour.injectPropertyOne.testMethod(), 'ProviderOne.testMethod');
  assert.is(context.sandbox.stubs.onInit.callCount, 5);
});

test('should unset providers', (context) => {
  // Create instances.
  context.container.get(context.providers.providerOne.name);
  context.container.get(context.providers.providerTwo.name);
  context.container.get(context.providers.providerThree.name);
  context.container.get(context.providers.providerFour.name);

  // Begin unset.
  context.container.unset(context.providers.providerOne.name);
  assert.throws(
    () => context.container.get(context.providers.providerOne.name),
    (err) => err instanceof ProviderNotFoundException,
  );
  assert.instance(context.container.get(context.providers.providerTwo.name), context.providers.providerTwo);
  assert.instance(context.container.get(context.providers.providerThree.name), context.providers.providerThree);
  assert.instance(context.container.get(context.providers.providerFour.name), context.providers.providerFour);

  context.container.unsetAll();
  assert.throws(
    () => context.container.get(context.providers.providerTwo.name),
    (err) => err instanceof ProviderNotFoundException,
  );
  assert.throws(
    () => context.container.get(context.providers.providerThree.name),
    (err) => err instanceof ProviderNotFoundException,
  );
  assert.throws(
    () => context.container.get(context.providers.providerFour.name),
    (err) => err instanceof ProviderNotFoundException,
  );
  assert.is(context.sandbox.stubs.onDestroy.callCount, 5);
});

test.run();
