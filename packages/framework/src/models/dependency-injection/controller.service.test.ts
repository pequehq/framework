import 'reflect-metadata';

import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ExpressMocks } from '../../../test/mocks/express.mocks';
import { Controller, Get, Guard, Intercept, Interceptor, Middleware, Post, UseMiddleware } from '../../decorators';
import { LifeCycleManager } from '../../services/life-cycle/life-cycle.service';
import { NATIVE_SERVICES } from '../constants/native-services';
import { CanExecute } from '../interfaces/authorization.interface';
import { InterceptorHandler } from '../interfaces/interceptor/interceptor.interface';
import { MiddlewareHandler } from '../interfaces/middleware.interface';
import { Controllers } from './controller.service';
import { Injector } from './dependency-injection.service';

const test = suite('Controller service');

const sandbox = sinon.createSandbox();
const expressMocks = new ExpressMocks();

test.after.each(() => {
  sandbox.restore();
  expressMocks.restore();

  Controllers.flush();
});

test('should initialize controllers', async () => {
  const injectorResolve = sandbox.stub(Injector, 'resolve');
  const triggerControllerInit = sandbox.stub(LifeCycleManager, 'triggerControllerInit');

  @Controller('/path-controller-one')
  class TestController1 {}

  @Controller('/path-controller-two')
  class TestController2 {}

  Controllers.push(TestController1);
  Controllers.push(TestController2);

  // Check that controller classes have been pushed.
  assert.equal(Controllers.getAll(), [TestController1, TestController2]);

  await Controllers.initControllers(expressMocks.mockApplication());

  // Check that logger has been resolved.
  assert.ok(injectorResolve.calledWith('injectable', NATIVE_SERVICES.LOGGER));
  assert.is(injectorResolve.callCount, 1);

  // Check that controllers have been instantiated.
  assert.is(Controllers.getInstances().length, 2);
  assert.instance(Controllers.getInstances()[0], TestController1);
  assert.instance(Controllers.getInstances()[1], TestController2);

  // Check that LifeCycleManager.triggerControllerInit has been called for each instance.
  assert.is(triggerControllerInit.callCount, 2);
  assert.ok(triggerControllerInit.calledWith(sandbox.match.instanceOf(TestController1)));
  assert.ok(triggerControllerInit.calledWith(sandbox.match.instanceOf(TestController2)));
});

test('should load controller interceptors', async () => {
  const injectorResolve = sandbox.stub(Injector, 'resolve');

  @Interceptor()
  class TestInterceptor implements InterceptorHandler {
    after(): void {
      // noop.
    }

    before(): void {
      // noop.
    }

    error(): void {
      // noop.
    }
  }

  @Intercept(TestInterceptor)
  @Controller('/path')
  class TestController {}

  Controllers.push(TestController);
  assert.equal(Controllers.getAll(), [TestController]);

  await Controllers.initControllers(expressMocks.mockApplication());
  assert.is(Controllers.getInstances().length, 1);
  assert.instance(Controllers.getInstances()[0], TestController);

  // Check that Injector.resolve has been called for the interceptors.
  assert.ok(injectorResolve.calledWith('interceptor', 'TestInterceptor'));
  assert.is(injectorResolve.callCount, 4); // logger + interceptor (before + after + error).
});

test('should load controller guards', async () => {
  const application = expressMocks.mockApplication();
  const injectorResolve = sandbox.stub(Injector, 'resolve');

  class TestGuard implements CanExecute {
    canExecute(): Promise<boolean> {
      return Promise.resolve(false);
    }
  }

  @Guard(TestGuard)
  @Controller('/path')
  class TestController {}

  Controllers.push(TestController);
  assert.equal(Controllers.getAll(), [TestController]);

  await Controllers.initControllers(application);
  assert.is(Controllers.getInstances().length, 1);
  assert.instance(Controllers.getInstances()[0], TestController);

  // Check that the guard has been registered.
  assert.ok(injectorResolve.calledWith('injectable', 'TestGuard'));
  assert.ok(expressMocks.spy('app.use').calledWith('/path', [sinon.match.func]));
});

test('should load controller middlewares', async () => {
  const application = expressMocks.mockApplication();

  @Middleware()
  class TestMiddleware implements MiddlewareHandler {
    handler(): void {
      // noop.
    }
  }

  @UseMiddleware(TestMiddleware)
  @Controller('/path')
  class TestController {}

  const injectorResolve = sandbox.stub(Injector, 'resolve').callsFake((type, provider) => {
    if (type === 'middleware' && provider === 'TestMiddleware') {
      return new TestMiddleware();
    }

    return undefined;
  });

  Controllers.push(TestController);
  assert.equal(Controllers.getAll(), [TestController]);

  await Controllers.initControllers(application);
  assert.is(Controllers.getInstances().length, 1);
  assert.instance(Controllers.getInstances()[0], TestController);

  // Check that the middleware has been registered.
  assert.ok(injectorResolve.calledWith('middleware', 'TestMiddleware'));
  assert.ok(expressMocks.spy('app.use').calledWith('/path', [TestMiddleware.prototype.handler]));
});

test('should register routes', async () => {
  const application = expressMocks.mockApplication();
  const routeLog = sandbox.fake();

  // stub Injector.resolve().
  sandbox.stub(Injector, 'resolve').callsFake((type, provider) => {
    if (type === 'injectable' && provider === NATIVE_SERVICES.LOGGER) {
      return { log: routeLog };
    }

    return undefined;
  });

  @Controller('/path')
  class TestController {
    @Get('/pizza')
    getPizza(): string {
      return 'pizza';
    }

    @Post('/pizza')
    savePizza(): void {
      return;
    }
  }

  Controllers.push(TestController);
  assert.equal(Controllers.getAll(), [TestController]);

  await Controllers.initControllers(application);
  assert.is(Controllers.getInstances().length, 1);
  assert.instance(Controllers.getInstances()[0], TestController);

  // Check that logs have been written.
  assert.is(routeLog.callCount, 2);

  for (const method of ['get', 'post']) {
    assert.ok(
      routeLog.calledWith({
        level: 'debug',
        data: `[${method}] /path/pizza`,
      }),
    );

    // Check that routes have been registered.
    const spiedMethod = method === 'get' ? expressMocks.spy('app.get') : expressMocks.spy('app.post');

    sandbox.assert.calledWith(
      spiedMethod,
      '/path/pizza',
      [],
      [],
      [],
      [],
      sandbox.match.func, // handler
      [],
      [],
      sandbox.match.func, // responder
      [],
      [],
    );
  }
});

test('should not register routes having documentOnly = true', async () => {
  const application = expressMocks.mockApplication();
  sandbox.stub(Injector, 'resolve');

  @Controller('/path')
  class TestController {
    @Get('/pizza', true)
    getPizza(): string {
      return 'pizza';
    }
  }

  Controllers.push(TestController);
  assert.equal(Controllers.getAll(), [TestController]);

  await Controllers.initControllers(application);
  assert.is(Controllers.getInstances().length, 1);
  assert.instance(Controllers.getInstances()[0], TestController);

  sandbox.assert.notCalled(expressMocks.spy('app.get'));
});

test.run();
