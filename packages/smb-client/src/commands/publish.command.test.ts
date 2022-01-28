import { EventService, IPublishCommand } from '@peque/smb-commons';
import { wait } from '@peque/test';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { DI, loadProviders } from '../../test/test.utils';
import { PublishCommand } from './publish.command';
import { SubscribeListenerService } from '../services';
import { Listener } from '../models';

const test = suite('Message Command');

test.before.each((context) => {
  const listenerOne: Listener = (command): unknown => ({ ...command, from: 'listenerOne' });
  const listenerTwo: Listener = (command): unknown => ({ ...command, from: 'listenerTwo' });

  context.sandbox = sinon.createSandbox();
  context.spies = {
    listenerOne: context.sandbox.spy(listenerOne),
    listenerTwo: context.sandbox.spy(listenerTwo),
    subsFind: context.sandbox.spy(SubscribeListenerService.prototype, 'find'),
    eventOn: context.sandbox.spy(EventService.prototype, 'on'),
    eventNext: context.sandbox.spy(EventService.prototype, 'next'),
  };
  context.commands = {
    publish: {
      command: 'publish',
      socketId: 'id_1',
      action: {
        topic: 'topic',
        message: 'test message',
      },
      issueTimestamp: 1234567890,
    } as IPublishCommand,
  };

  loadProviders();
  DI.get<PublishCommand>('PublishCommand');
  context.subs = DI.get<SubscribeListenerService>('SubscribeListenerService');
  context.events = DI.get<EventService>('EventService');
});

test.after.each((context) => {
  context.sandbox.restore();
  DI.unsetAll();
});

test('should process a publish command', async (context) => {
  context.subs.set('^to', context.spies.listenerOne);
  context.subs.set('topic', context.spies.listenerTwo);

  assert.is(context.spies.eventOn.calledOnce, true);

  context.events.next('publish', context.commands.publish);

  await wait();

  assert.is(context.spies.subsFind.calledOnce, true);
  assert.ok(context.spies.subsFind.calledWith(context.commands.publish.action.topic));
  assert.equal(context.spies.subsFind.returnValues[0], context.subs.find(context.commands.publish.action.topic));

  assert.is(context.spies.listenerOne.called, true);
  assert.ok(context.spies.listenerOne.calledWith(context.commands.publish));
  assert.equal(context.spies.listenerOne.returnValues[0], { ...context.commands.publish, from: 'listenerOne' });

  assert.is(context.spies.listenerTwo.calledOnce, true);
  assert.ok(context.spies.listenerTwo.calledWith(context.commands.publish));
  assert.equal(context.spies.listenerTwo.returnValues[0], { ...context.commands.publish, from: 'listenerTwo' });
});

test.run();
