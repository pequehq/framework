import { EventService, ISubscribeCommand } from '@peque/smb-commons';
import { wait } from '@peque/test';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { DI, loadProviders } from '../../test/test.utils';
import { SubscribeCommand } from './subscribe.command';

const test = suite('Subscribe Command');

test.before.each((context) => {
  context.sandbox = sinon.createSandbox();
  context.spies = {
    eventOn: context.sandbox.spy(EventService.prototype, 'on'),
    eventNext: context.sandbox.spy(EventService.prototype, 'next'),
  };
  context.commands = {
    subscribe: {
      command: 'subscribe',
      socketId: 'id_1',
      action: { topic: 'topic' },
      issueTimestamp: 1234567890,
    } as ISubscribeCommand,
  };

  loadProviders();
  context.subscribe = DI.get<SubscribeCommand>('SubscribeCommand');
  context.events = DI.get<EventService>('EventService');
});

test.after.each((context) => {
  context.sandbox.restore();
  DI.unsetAll();
});

test('should process a subscribe command', async (context) => {
  context.subscribe.init();

  assert.is(context.spies.eventOn.calledOnce, true);

  context.events.next('subscribe', context.commands.subscribe);

  await wait();

  assert.is(context.spies.eventNext.callCount, 2);
  assert.ok(context.spies.eventNext.calledWith('outgoingCommand', context.commands.subscribe));
});

test.run();
