import { ControllerDefinition } from '../src/models/controller-definition.interface';
import { Injectable } from '../src/decorators/injectable';
import { ProviderDefinition } from '../src/models/interfaces/provider-definition.interface';
import { Module } from '../src/decorators/module';
import { Controllers } from '../src/models/dependency-injection/controller.service';
import { Injector } from '../src/models/dependency-injection/injector.service';
import { loadInjectables } from '../src/utils/dependencies.utils';
import { SERVICES } from '../jest.setup';

describe('@Module() decorator',() => {
  beforeAll(async () => await loadInjectables());

  it ('should contain TestModule ModuleDefinition', async () => {
    const testMiddleware = () => {};
    const testController: ControllerDefinition = {
      prefix: '/test-controller',
      middlewares: [testMiddleware]
    }

    const testControllers = [testController];

    class TestServiceOne {}

    @Injectable()
    class TestServiceTwo {}

    @Injectable({ interface: 'TestProviderUseClassThree' })
    class TestServiceThree {}

    const testProviderService: ProviderDefinition = {
      provider: 'TestProviderUseClassTwo',
      useClass: TestServiceOne
    }

    const serviceMap = new Map<string, any>();
    serviceMap.set('TestProviderUseClassTwo', new TestServiceOne());
    serviceMap.set(TestServiceTwo.name, new TestServiceTwo());
    serviceMap.set('TestProviderUseClassThree', new TestServiceOne());

    @Module({
      controllers: [testController],
      providers: [testProviderService, TestServiceTwo]
    })
    class TestModule { }

    await loadInjectables();

    const controllers = Controllers.getAll();
    expect(controllers).toEqual(testControllers);

    SERVICES.forEach(service => Injector.getProviders().delete(service));
    expect(Injector.getProviders()).toEqual(serviceMap);
  });
});
