import { wait } from 'peque-test';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { DI, loadProviders } from '../../../test/test.utils';
import { CommandInvalidException, CommandParsingException } from '../../models';
import { EventService } from '../events/event.service';
import { CommandReceiver } from './command-receiver.class';

const test = suite('Command Receiver');

test.before.each((context) => {
  context.sandbox = sinon.createSandbox();
  context.spies = {
    eventOn: context.sandbox.spy(EventService.prototype, 'on'),
    eventNext: context.sandbox.spy(EventService.prototype, 'next'),
  };
  context.command = {
    command: 'subscribe',
    action: { topic: 'topic' },
    issueTimestamp: 1234567890,
    socketId: 'id_1',
  };

  loadProviders();
  context.receiver = DI.get<CommandReceiver>('CommandReceiver');
  context.events = DI.get<EventService>('EventService');
});

test.after.each((context) => {
  context.sandbox.restore();
  DI.unsetAll();
});

test('should receive a command', async (context) => {
  context.receiver.init();
  assert.is(context.spies.eventOn.calledOnce, true);

  context.events.next('incomingCommand', JSON.stringify(context.command));

  await wait();

  assert.ok(context.spies.eventNext.calledWith(context.command.command, context.command));
});

test('should receive a command and throw parse error', (context) => {
  context.receiver.init();
  assert.is(context.spies.eventOn.calledOnce, true);

  try {
    context.events.next('incomingCommand', '{"foo": 1,}');
  } catch (error) {
    assert.instance(error, CommandParsingException);
    assert.ok(context.spies.eventNext.calledWith('error', error));
  }
});

test('should receive a command and throw parse invalid command', (context) => {
  context.receiver.init();
  assert.is(context.spies.eventOn.calledOnce, true);

  try {
    context.events.next('incomingCommand', '{"foo": 1}');
  } catch (error) {
    assert.instance(error, CommandInvalidException);
    assert.ok(context.spies.eventNext.calledWith('error', error));
  }
});

test.run();
