import { EventService, ISubscribeCommand } from 'peque-smb-commons/src';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { DI, loadProviders, wait } from '../../test/test.utils';
import { SubscribeService } from '../services';
import { SubscribeCommand } from './subscribe.command';

const test = suite('Subscribe Command');

test.before.each((context) => {
  context.sandbox = sinon.createSandbox();
  context.spies = {
    eventOn: context.sandbox.spy(EventService.prototype, 'on'),
  };
  context.commands = {
    subscribe: {
      command: 'subscribe',
      socketId: 'id_1',
      action: {
        topic: 'topic',
      },
      issueTimestamp: 1234567890,
    } as ISubscribeCommand,
  };

  loadProviders();
  DI.get<SubscribeCommand>('SubscribeCommand');
  context.subs = DI.get<SubscribeService>('SubscribeService');
  context.events = DI.get<EventService>('EventService');
});

test.after.each((context) => {
  context.sandbox.restore();
  context.subs.clear();
  DI.unsetAll();
});

test('should subscribe a client to a topic', async (context) => {
  assert.is(context.spies.eventOn.calledOnce, true);

  context.events.next('subscribe', context.commands.subscribe);

  await wait();

  assert.equal(context.subs.find('topic'), ['id_1']);
});

test.run();
