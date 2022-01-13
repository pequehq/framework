import 'reflect-metadata';

import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { Controllers } from '../models/dependency-injection/controller.service';
import { Injector } from '../models/dependency-injection/dependency-injection.service';
import { Modules } from '../models/dependency-injection/module.service';
import { Module } from './module';

const test = suite('Module');

test.after.each(() => {
  Modules.flush();
});

test('should add the decorated class to the framework modules', async () => {
  @Module({
    controllers: [],
  })
  class TestModule {}

  const modules = Modules.getAll();
  assert.is(modules.length, 1);
  assert.is(modules[0], TestModule);
});

test('should add controllers to the framework controllers', async () => {
  const controllersPush = sinon.stub(Controllers, 'push');

  class TestController {}

  @Module({
    controllers: [TestController],
  })
  class TestModule {}

  assert.is(Modules.getAll()[0], TestModule);
  assert.ok(controllersPush.calledWith(TestController));

  controllersPush.restore();
});

test('should add custom providers to the framework providers when specified as { provider (string), useClass }', async () => {
  const providersAdd = sinon.stub(Injector, 'add');

  class NativeProvider {}

  @Module({
    controllers: [],
    providers: [
      {
        provider: 'TestProvider',
        useClass: NativeProvider,
      },
    ],
  })
  class TestModule {}

  assert.is(Modules.getAll()[0], TestModule);
  assert.ok(
    providersAdd.calledWith({
      name: 'TestProvider',
      clazz: NativeProvider,
      type: 'injectable',
    }),
  );

  providersAdd.restore();
});

test('should add custom providers to the framework providers when specified as { provider (class), useClass }', async () => {
  const providersAdd = sinon.stub(Injector, 'add');

  class TestProvider {}
  class NativeProvider {}

  @Module({
    controllers: [],
    providers: [
      {
        provider: TestProvider,
        useClass: NativeProvider,
      },
    ],
  })
  class TestModule {}

  assert.is(Modules.getAll()[0], TestModule);
  assert.ok(
    providersAdd.calledWith({
      name: 'TestProvider',
      clazz: NativeProvider,
      type: 'injectable',
    }),
  );

  providersAdd.restore();
});

test('should not add non-custom providers to the framework providers', async () => {
  const providersAdd = sinon.stub(Injector, 'add');

  class TestProvider {}

  @Module({
    controllers: [],
    providers: [TestProvider],
  })
  class TestModule {}

  assert.is(Modules.getAll()[0], TestModule);
  assert.is(providersAdd.callCount, 0);

  providersAdd.restore();
});

test.run();
