import { BrokerSocket, Command, EventService, SocketService } from '@peque/smb-commons';
import { validateUUID } from '@peque/test';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { DI, loadProviders } from '../di';
import { Broker } from './broker.class';
import { net } from './net';

const test = suite('Broker Server');

test.before.each((context) => {
  context.sandbox = sinon.createSandbox();

  const serverOnSpy = context.sandbox.spy((event, listener) => listener(new BrokerSocket()));
  const serverListenSpy = context.sandbox.spy((port, host, resolve) => resolve());

  context.spies = {
    commandInit: context.sandbox.spy(Command.prototype, 'init'),
    socketOn: context.sandbox.spy(BrokerSocket.prototype, 'on'),
    eventsOn: context.sandbox.spy(EventService.prototype, 'on'),
    eventsNext: context.sandbox.spy(EventService.prototype, 'next'),
    socketsSet: context.sandbox.spy(SocketService.prototype, 'set'),
    serverOn: serverOnSpy,
    serverListen: serverListenSpy,
  };
  context.stubs = {
    socketWrite: context.sandbox.stub(BrokerSocket.prototype, 'write'),
    createServer: context.sandbox.stub(net, 'createServer').returns({
      on: serverOnSpy,
      listen: serverListenSpy,
    }),
  };

  loadProviders();
  context.broker = DI.get<Broker>('Broker');
});

test.after.each((context) => {
  context.sandbox.restore();
  DI.unsetAll();
});

test('should create a broker server', async (context) => {
  await context.broker.create();

  assert.is(context.spies.eventsOn.lastCall.firstArg, 'connection');
  assert.is(context.spies.serverOn.calledOnce, true);
  assert.is(context.spies.serverListen.calledOnce, true);
  assert.is(context.spies.eventsOn.lastCall.firstArg, 'connection');

  assert.is(context.spies.socketOn.called, true);
  assert.is(context.spies.socketsSet.calledOnce, true);

  assert.is(context.spies.eventsNext.lastCall.firstArg, 'outgoingCommand');
  const welcomeCommand = context.spies.eventsNext.lastCall.args[1];
  assert.is(welcomeCommand.command, 'welcome');
  assert.ok(!!welcomeCommand.socketId);
  assert.ok(validateUUID(welcomeCommand.socketId));
});

test.run();
