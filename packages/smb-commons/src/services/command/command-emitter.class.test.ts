import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { DI, loadProviders, wait } from '../../../test/test.utils';
import { BrokerSocket, CommandInvalidException } from '../../models';
import { EventService } from '../events/event.service';
import { SocketService } from '../socket/socket.service';
import { CommandEmitter } from './command-emitter.class';

const test = suite('Command Emitter');

test.before.each((context) => {
  context.sandbox = sinon.createSandbox();
  context.stubs = {
    socketWrite: context.sandbox.stub(BrokerSocket.prototype, 'write'),
  };
  context.spies = {
    eventOn: context.sandbox.spy(EventService.prototype, 'on'),
    eventNext: context.sandbox.spy(EventService.prototype, 'next'),
    socketsGet: context.sandbox.spy(SocketService.prototype, 'get'),
  };
  context.command = {
    command: 'subscribe',
    action: { topic: 'topic' },
    issueTimestamp: 1234567890,
    socketId: 'id_1',
  };

  loadProviders();
  context.emitter = DI.get<CommandEmitter>('CommandEmitter');
  context.events = DI.get<EventService>('EventService');
  context.sockets = DI.get<SocketService>('SocketService');
});

test.after.each((context) => {
  context.sandbox.restore();
  DI.unsetAll();
});

test('should emit a command', (context) => {
  const socket = new BrokerSocket();
  socket.id = 'id_1';
  context.sockets.set(socket);

  context.emitter.init();
  assert.is(context.spies.eventOn.calledOnce, true);

  context.events.next('outgoingCommand', context.command);

  wait();

  assert.ok(context.spies.socketsGet.calledWith(socket.id));
});

test('should emit a command and throw invalid command', (context) => {
  context.emitter.init();
  assert.is(context.spies.eventOn.calledOnce, true);

  try {
    context.events.next('outgoingCommand', '{"foo": 1}');
  } catch (error) {
    assert.instance(error, CommandInvalidException);
    assert.ok(context.spies.eventNext.calledWith('error', error));
  }
});

test.run();
