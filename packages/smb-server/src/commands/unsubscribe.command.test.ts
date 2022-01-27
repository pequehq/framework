import { EventService, IUnsubscribeCommand } from 'peque-smb-commons';
import { wait } from 'peque-test';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { DI, loadProviders } from '../../test/test.utils';
import { SubscribeService } from '../services';
import { UnsubscribeCommand } from './unsubscribe.command';

const test = suite('Unsubscribe Command');

test.before.each((context) => {
  context.sandbox = sinon.createSandbox();
  context.spies = {
    eventOn: context.sandbox.spy(EventService.prototype, 'on'),
  };
  context.commands = {
    unsubscribe: {
      command: 'unsubscribe',
      socketId: 'id_1',
      action: {
        topic: 'topic',
      },
      issueTimestamp: 1234567890,
    } as IUnsubscribeCommand,
  };

  loadProviders();
  DI.get<UnsubscribeCommand>('UnsubscribeCommand');
  context.subs = DI.get<SubscribeService>('SubscribeService');
  context.events = DI.get<EventService>('EventService');
});

test.after.each((context) => {
  context.sandbox.restore();
  context.subs.clear();
  DI.unsetAll();
});

test('should subscribe a client to a topic', async (context) => {
  context.subs.set('topic', 'id_1');
  context.subs.set('topic', 'id_2');

  assert.is(context.spies.eventOn.calledOnce, true);
  assert.equal(context.subs.find('topic'), ['id_1', 'id_2']);

  context.events.next('unsubscribe', context.commands.unsubscribe);

  await wait();

  assert.equal(context.subs.find('topic'), ['id_2']);
});

test.run();
