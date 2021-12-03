import { Injector } from '../src/models/dependency-injection/injector.service';

describe('ControllerService', () => {
  class TestServiceOne {}
  class TestServiceTwo {}

  Injector.set(TestServiceOne.name, TestServiceOne);
  Injector.set(TestServiceTwo.name, TestServiceTwo);
  Injector.set(TestServiceTwo.name, TestServiceTwo);

  const serviceMap = new Map<string, any>();

  serviceMap.set(TestServiceOne.name, new TestServiceOne());
  serviceMap.set(TestServiceTwo.name, new TestServiceTwo());

  it('should return all the set providers as singletons', () => {
    expect(serviceMap).toEqual(Injector.getProviders());
  });

  it('should resolve the requested providers', () => {
    expect(new TestServiceOne()).toEqual(Injector.resolve('TestServiceOne'));
    expect(new TestServiceTwo()).toEqual(Injector.resolve('TestServiceTwo'));
  });

  it('should throw error when resolving a non-existent provider', () => {
    expect(() => Injector.resolve('NotExistProvider')).toThrowError();
  });
});
