import { ControllerDefinition } from '../src/models/controller-definition.interface';
import { Injectable } from '../src/decorators/injectable';
import { ProviderDefinition } from '../src/models/interfaces/provider-definition.interface';
import { Module } from '../src/decorators/module';
import { Controllers } from '../src/models/dependency-injection/controller.service';
import { Injector } from '../src/models/dependency-injection/injector.service';
import { loadInjectables } from '../src/utils/dependencies.utils';
import { NATIVE_SERVICES } from '../jest.setup';

describe('@Module() decorator', () => {
  const testMiddleware = () => {};
  const testController: ControllerDefinition = {
    prefix: '/test-controller',
    middlewares: [testMiddleware]
  }

  const testControllers = [testController];

  class TestServiceOne {}

  @Injectable()
  class TestServiceTwo {}

  const testProviderService: ProviderDefinition = {
    provider: 'TestProviderUseClass',
    useClass: TestServiceOne
  }

  const serviceMap = new Map<string, any>();
  serviceMap.set('TestProviderUseClass', new TestServiceOne());
  serviceMap.set(TestServiceTwo.name, new TestServiceTwo());

  loadInjectables();

  @Module({
    controllers: [testController],
    providers: [testProviderService, TestServiceTwo]
  })
  class TestModule { }

  const controllers = Controllers.getAll();

  it ('should contain TestModule ModuleDefinition', () => {
    expect(controllers).toEqual(testControllers);

    NATIVE_SERVICES.forEach(service => Injector.getProviders().delete(service));
    expect(Injector.getProviders()).toEqual(serviceMap);
  });
});
