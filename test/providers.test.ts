import { Inject, Injectable } from '../src/decorators/injectable';
import { loadInjectables } from '../src/utils/dependencies.utils';
import { Injector } from '../src/models/dependency-injection/injector.service';
import { SERVICES } from '../jest.setup';

describe('Decorators utils', () => {
  beforeAll(async () => await loadInjectables());

  it('it should contain the defined providers', async () => {
    @Injectable()
    class TestServiceOne { }

    @Injectable()
    class TestServiceTwo { }

    const serviceMap = new Map<string, any>();
    serviceMap.set(TestServiceOne.name, new TestServiceOne());
    serviceMap.set(TestServiceTwo.name, new TestServiceTwo());

    await loadInjectables();

    SERVICES.forEach(service => Injector.getProviders().delete(service));
    expect(Injector.getProviders()).toEqual(serviceMap);
  });

  it('should inject the service into the property', async () => {
    @Injectable()
    class TestServiceOne { }

    await loadInjectables();

    class TestInject {
      @Inject('TestServiceOne')
      testServiceOne: TestServiceOne
    }

    const testInject = new TestInject();
    expect(Injector.resolve('TestServiceOne')).toEqual(testInject.testServiceOne);
  });
});
