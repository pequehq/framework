import 'reflect-metadata';

import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ExpressMocks } from '../../../test/mocks/express.mocks';
import { Controller } from '../../decorators';
import { LifeCycleManager } from '../../services/life-cycle/life-cycle.service';
import { NATIVE_SERVICES } from '../constants/native-services';
import { Controllers } from './controller.service';
import { Injector } from './injector.service';

const test = suite('Controller service');

const sandbox = sinon.createSandbox();
const expressMocks = new ExpressMocks();

test.after.each(() => {
  sandbox.restore();
  expressMocks.restore();

  Controllers.flush();
});

test('should initialize controllers', async () => {
  const application = expressMocks.mockApplication();
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

  await Controllers.initControllers(application);

  // Check that logger has been resolved.
  assert.ok(injectorResolve.calledWith('injectable', NATIVE_SERVICES.LOGGER));
  assert.is(injectorResolve.callCount, 1);

  // Check that controllers have been instantiated.
  assert.is(Controllers.getInstances().length, 2);
  assert.instance(Controllers.getInstances()[0], TestController1);
  assert.instance(Controllers.getInstances()[1], TestController2);

  // CHeck that LifeCycleManager.triggerControllerInit has been called for each instance.
  assert.is(triggerControllerInit.callCount, 2);
  assert.ok(triggerControllerInit.calledWith(sandbox.match.instanceOf(TestController1)));
  assert.ok(triggerControllerInit.calledWith(sandbox.match.instanceOf(TestController2)));
});

test.skip('should load controller interceptors', async () => {
  // @TODO add test
});

test.skip('should load controller guards', async () => {
  // @TODO add test
});

test.skip('should load controller middlewares', async () => {
  // @TODO add test
});

test.skip('should not register routes having documentOnly = true', async () => {
  // @TODO add test
});

test.run();
