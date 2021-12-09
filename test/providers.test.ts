import { Inject, Injectable } from '../src/decorators/injectable';
import { loadInjectables } from '../src/utils/dependencies.utils';
import { Injector } from '../src/models/dependency-injection/injector.service';
import { SERVICES } from '../jest.setup';

describe('Decorators utils', () => {
  @Injectable()
  class TestServiceOne { }

  @Injectable()
  class TestServiceTwo { }

  const serviceMap = new Map<string, any>();
  serviceMap.set(TestServiceOne.name, new TestServiceOne());
  serviceMap.set(TestServiceTwo.name, new TestServiceTwo());

  loadInjectables();

  it('it should contain the defined providers', () => {
    SERVICES.forEach(service => Injector.getProviders().delete(service));
    expect(Injector.getProviders()).toEqual(serviceMap);
  });
});

describe('Decorators utils', () => {
  @Injectable()
  class TestServiceOne { }

  loadInjectables();

  class TestInject {
    @Inject('TestServiceOne')
    testServiceOne: TestServiceOne
  }

  const testInject = new TestInject();

  it('should inject the service into the property', () => {

    expect(Injector.resolve('TestServiceOne')).toEqual(testInject.testServiceOne);
  });
});
