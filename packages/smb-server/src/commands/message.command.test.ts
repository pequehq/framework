import { EventService, IMessageCommand } from '@peque/smb-commons';
import { wait } from '@peque/test';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { DI, loadProviders } from '../../test/test.utils';
import { SubscribeService } from '../services';
import { MessageCommand } from './message.command';

const test = suite('Message Command');

test.before.each((context) => {
  context.sandbox = sinon.createSandbox();
  context.spies = {
    eventOn: context.sandbox.spy(EventService.prototype, 'on'),
    eventNext: context.sandbox.spy(EventService.prototype, 'next'),
    subsFind: context.sandbox.spy(SubscribeService.prototype, 'find'),
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
  context.subs = DI.get<SubscribeService>('SubscribeService');
  context.events = DI.get<EventService>('EventService');
});

test.after.each((context) => {
  context.sandbox.restore();
  context.subs.clear();
  DI.unsetAll();
});

test('should process a message command', async (context) => {
  const testCommands = [
    ['message', { ...context.commands.message }],
    [
      'publish',
      {
        command: 'publish',
        socketId: 'id_1',
        action: context.commands.message.action,
      },
    ],
    [
      'publish',
      {
        command: 'publish',
        socketId: 'id_2',
        action: context.commands.message.action,
      },
    ],
  ];

  context.message.init();

  context.subs.set('topic', 'id_1');
  context.subs.set('topic', 'id_2');

  assert.is(context.spies.eventOn.calledOnce, true);

  context.events.next('message', context.commands.message);

  await wait();

  assert.ok(context.spies.subsFind.calledWith(context.commands.message.action.topic));
  assert.is(context.spies.eventNext.callCount, 3);

  // Getting the timestamps, which are the only not predictable values.
  testCommands[1][1].issueTimestamp = context.spies.eventNext.args[1][1].issueTimestamp;
  testCommands[2][1].issueTimestamp = context.spies.eventNext.args[2][1].issueTimestamp;
  assert.equal(context.spies.eventNext.args, testCommands);
});

test.run();
