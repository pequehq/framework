import sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { wait } from '../../../test/test.utils';
import {
  LifeCycleEventsType,
  OnControllerDestroy,
  OnControllerInit,
  OnModuleDestroy,
  OnModuleInit,
  OnProviderDestroy,
  OnProviderInit,
  OnServerBootstrap,
  OnServerListen,
  OnServerListenStop,
  OnServerShutdown,
  OnServerStarted,
  OnUncaughtException,
  OnUncaughtRejection,
  OnWebSocketDestroy,
  OnWebSocketInit,
} from '../../models';
import { Injector } from '../../models/dependency-injection/dependency-injection.service';
import { Subjects } from '../subjects/subjects';
import { LifeCycleManager } from './life-cycle.service';

interface LifeCycleInfoTest {
  name: string;
  event: LifeCycleEventsType;
  spy: string;
  fn: string;
}

const test = suite('Life Cycle Service');

test.before.each((context) => {
  class ProviderTest
    implements
      OnProviderInit,
      OnProviderDestroy,
      OnModuleInit,
      OnModuleDestroy,
      OnControllerInit,
      OnControllerDestroy,
      OnWebSocketInit,
      OnWebSocketDestroy,
      OnServerStarted,
      OnServerShutdown,
      OnServerListen,
      OnServerListenStop,
      OnServerBootstrap,
      OnUncaughtException,
      OnUncaughtRejection
  {
    onProviderDestroy(): void {
      // noop.
    }

    onProviderInit(): void {
      // noop.
    }

    onControllerDestroy(): void {
      // noop.
    }

    onControllerInit(): void {
      // noop.
    }

    onModuleDestroy(): void {
      // noop.
    }

    onModuleInit(): void {
      // noop.
    }

    onWebSocketDestroy(): void {
      // noop.
    }

    onWebSocketInit(): void {
      // noop.
    }

    onServerBootstrap(): void {
      // noop.
    }

    onServerListen(): void {
      // noop.
    }

    onServerListenStop(): void {
      // noop.
    }

    onServerShutdown(): void {
      // noop.
    }

    onServerStarted(): void {
      // noop.
    }

    onUncaughtException(): void {
      // noop.
    }

    onUncaughtRejection(): void {
      // noop.
    }
  }

  context.sandbox = sinon.createSandbox();
  context.spies = {
    providerInitSpy: context.sandbox.spy(ProviderTest.prototype, 'onProviderInit'),
    providerDestroySpy: context.sandbox.spy(ProviderTest.prototype, 'onProviderDestroy'),
    moduleInitSpy: context.sandbox.spy(ProviderTest.prototype, 'onModuleInit'),
    moduleDestroySpy: context.sandbox.spy(ProviderTest.prototype, 'onModuleDestroy'),
    controllerInitSpy: context.sandbox.spy(ProviderTest.prototype, 'onControllerInit'),
    controllerDestroySpy: context.sandbox.spy(ProviderTest.prototype, 'onControllerDestroy'),
    websocketInitSpy: context.sandbox.spy(ProviderTest.prototype, 'onWebSocketInit'),
    websocketDestroySpy: context.sandbox.spy(ProviderTest.prototype, 'onWebSocketDestroy'),
    serverStartedSpy: context.sandbox.spy(ProviderTest.prototype, 'onServerStarted'),
    serverShutdownSpy: context.sandbox.spy(ProviderTest.prototype, 'onServerShutdown'),
    serverListenSpy: context.sandbox.spy(ProviderTest.prototype, 'onServerListen'),
    serverListenStopSpy: context.sandbox.spy(ProviderTest.prototype, 'onServerListenStop'),
    serverBootstrapSpy: context.sandbox.spy(ProviderTest.prototype, 'onServerBootstrap'),
    uncaughtExceptionSpy: context.sandbox.spy(ProviderTest.prototype, 'onUncaughtException'),
    uncaughtRejectionSpy: context.sandbox.spy(ProviderTest.prototype, 'onUncaughtRejection'),
  };

  Injector.setNative('injectable', 'ProviderTest', ProviderTest);
  context.provider = Injector.resolve<ProviderTest>('injectable', 'ProviderTest');
});

test.after.each(async (context) => {
  context.sandbox.restore();
  await Injector.unsetAll();
});

const providerTests: LifeCycleInfoTest[] = [
  {
    name: 'provider init',
    event: 'lifecycle.init.provider',
    spy: 'providerInitSpy',
    fn: 'triggerProviderInit',
  },
  {
    name: 'provider destroy',
    event: 'lifecycle.destroy.provider',
    spy: 'providerDestroySpy',
    fn: 'triggerProviderDestroy',
  },
  { name: 'module init', event: 'lifecycle.init.module', spy: 'moduleInitSpy', fn: 'triggerModuleInit' },
  {
    name: 'module destroy',
    event: 'lifecycle.destroy.module',
    spy: 'moduleDestroySpy',
    fn: 'triggerModuleDestroy',
  },
  {
    name: 'controller init',
    event: 'lifecycle.init.controller',
    spy: 'controllerInitSpy',
    fn: 'triggerControllerInit',
  },
  {
    name: 'controller destroy',
    event: 'lifecycle.destroy.controller',
    spy: 'controllerDestroySpy',
    fn: 'triggerControllerDestroy',
  },
  {
    name: 'websocket init',
    event: 'lifecycle.init.websocket',
    spy: 'websocketInitSpy',
    fn: 'triggerWebSocketsInit',
  },
  {
    name: 'websocket destroy',
    event: 'lifecycle.destroy.websocket',
    spy: 'websocketDestroySpy',
    fn: 'triggerWebSocketsDestroy',
  },
];

for (const providerTest of providerTests) {
  test(`should trigger ${providerTest.name}`, async (context) => {
    let lifeCycleEvent;
    Subjects.lifeCycleSubject.subscribe((event) => (lifeCycleEvent = event));

    await LifeCycleManager[providerTest.fn](context.provider);

    await wait();

    assert.is.not(lifeCycleEvent, undefined);
    assert.is(lifeCycleEvent.event.event, 'lifecycle');
    assert.equal(lifeCycleEvent.data, {
      event: providerTest.event,
      data: { instance: context.provider.constructor.name },
    });
    assert.ok(context.spies[providerTest.spy].calledOnce);
  });
}

const serverTests: LifeCycleInfoTest[] = [
  {
    name: 'server start',
    event: 'lifecycle.server.started',
    spy: 'serverStartedSpy',
    fn: 'triggerServerStarted',
  },
  {
    name: 'server shutdown',
    event: 'lifecycle.server.shutdown',
    spy: 'serverShutdownSpy',
    fn: 'triggerServerShutdown',
  },
  {
    name: 'server listening',
    event: 'lifecycle.server.listening',
    spy: 'serverListenSpy',
    fn: 'triggerServerListen',
  },
  {
    name: 'server listening stop',
    event: 'lifecycle.server.listening.stop',
    spy: 'serverListenStopSpy',
    fn: 'triggerServerListenStop',
  },
  {
    name: 'bootstrap',
    event: 'lifecycle.bootstrap',
    spy: 'serverBootstrapSpy',
    fn: 'triggerServerBootstrap',
  },
];

for (const serverTest of serverTests) {
  test(`should trigger ${serverTest.name}`, async (context) => {
    let lifeCycleEvent;
    Subjects.lifeCycleSubject.subscribe((event) => (lifeCycleEvent = event));

    await LifeCycleManager[serverTest.fn]();

    await wait();

    assert.is.not(lifeCycleEvent, undefined);
    assert.is(lifeCycleEvent.event.event, 'lifecycle');
    assert.equal(lifeCycleEvent.data, {
      event: serverTest.event,
      data: {},
    });
    assert.ok(context.spies[serverTest.spy].calledOnce);
  });
}

const exceptionTests: LifeCycleInfoTest[] = [
  {
    name: 'uncaught exception',
    event: 'lifecycle.uncaught.exception',
    spy: 'uncaughtExceptionSpy',
    fn: 'triggerUncaughtException',
  },
  {
    name: 'uncaught rejection',
    event: 'lifecycle.uncaught.rejection',
    spy: 'uncaughtRejectionSpy',
    fn: 'triggerUncaughtRejection',
  },
];

for (const exceptionTest of exceptionTests) {
  test(`should trigger ${exceptionTest.name}`, async (context) => {
    let lifeCycleEvent;
    Subjects.lifeCycleSubject.subscribe((event) => (lifeCycleEvent = event));

    const error = new Error('test error');
    await LifeCycleManager[exceptionTest.fn](error);

    await wait();

    assert.is.not(lifeCycleEvent, undefined);
    assert.is(lifeCycleEvent.event.event, 'lifecycle');
    assert.equal(lifeCycleEvent.data, {
      event: exceptionTest.event,
      data: { error },
    });
    assert.instance(lifeCycleEvent.data.data.error, Error);
    assert.ok(context.spies[exceptionTest.spy].calledOnce);
  });
}

test.run();
