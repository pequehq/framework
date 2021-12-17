import { Injector } from '../src/models/dependency-injection/injector.service';
import { loadInjectables } from '../src/utils/dependencies.utils';

describe('ControllerService', () => {
  beforeAll(async () => await loadInjectables());

  class TestServiceOne {}
  class TestServiceTwo {}

  it('should return all the set providers as singletons', async () => {
    await Injector.set(TestServiceOne.name, TestServiceOne);
    await Injector.set(TestServiceTwo.name, TestServiceTwo);
    await Injector.set(TestServiceTwo.name, TestServiceTwo);

    const serviceMap = new Map<string, any>();

    serviceMap.set(TestServiceOne.name, new TestServiceOne());
    serviceMap.set(TestServiceTwo.name, new TestServiceTwo());

    serviceMap.forEach((value, key) => {
      expect(Injector.getProviders().get(key)).toStrictEqual(value);
    });
  });

  it('should resolve the requested providers', () => {
    expect(new TestServiceOne()).toEqual(Injector.resolve('TestServiceOne'));
    expect(new TestServiceTwo()).toEqual(Injector.resolve('TestServiceTwo'));
  });

  it('should throw error when resolving a non-existent provider', () => {
    expect(() => Injector.resolve('NotExistProvider')).toThrowError();
  });
});
