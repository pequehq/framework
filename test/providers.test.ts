import { Injectable } from '../src/decorators/injectable';
import { loadInjectables } from '../src/utils/dependencies.utils';
import { Injector } from '../src/models/dependency-injection/injector.service';

describe('Decorators utils', () => {
  @Injectable()
  class TestServiceOne {}

  @Injectable()
  class TestServiceTwo {}

  const serviceMap = new Map<string, any>();

  serviceMap.set(TestServiceOne.name, new TestServiceOne());
  serviceMap.set(TestServiceTwo.name, new TestServiceTwo());

  loadInjectables();

  it('it should contain the defined providers', () => {
    Injector.getProviders().delete('ControllerService');
    expect(Injector.getProviders()).toEqual(serviceMap);
  });
});
