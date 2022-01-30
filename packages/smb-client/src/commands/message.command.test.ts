import { EventService, IMessageCommand } from '@peque/smb-commons';
import { wait } from '@peque/test';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { DI, loadProviders } from '../../test/test.utils';
import { MessageCommand } from './message.command';

const test = suite('Message Command');

test.before.each((context) => {
  context.sandbox = sinon.createSandbox();
  context.spies = {
    eventOn: context.sandbox.spy(EventService.prototype, 'on'),
    eventNext: context.sandbox.spy(EventService.prototype, 'next'),
  };
  context.commands = {
    message: {
      command: 'message',
      socketId: 'id_1',
      action: {
        topic: 'topic',
        message: 'test message',
      },
      issueTimestamp: 1234567890,
    } as IMessageCommand,
  };

  loadProviders();
  context.message = DI.get<MessageCommand>('MessageCommand');
  context.events = DI.get<EventService>('EventService');
});

test.after.each((context) => {
  context.sandbox.restore();
  DI.unsetAll();
});

test('should process a message command', async (context) => {
  context.message.init();

  assert.is(context.spies.eventOn.calledOnce, true);

  context.events.next('message', context.commands.message);

  await wait();

  assert.is(context.spies.eventNext.callCount, 2);
  assert.ok(context.spies.eventNext.calledWith('outgoingCommand', context.commands.message));
});

test.run();
