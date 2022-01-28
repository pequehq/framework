import { ISubscribeCommand } from '@peque/smb-commons';
import sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { DI, loadProviders } from '../../../test/test.utils';
import { Listener } from '../../models';
import { SubscribeListenerService } from './subscription-listener.service';

const test = suite('Subscription Listener Service');

test.before.each((context) => {
  const listenerOne: Listener = (command): unknown => ({ ...command, from: 'listenerOne' });
  const listenerTwo: Listener = (command): unknown => ({ ...command, from: 'listenerTwo' });

  loadProviders();
  context.sandbox = sinon.createSandbox();
  context.subsService = DI.get<SubscribeListenerService>('SubscribeListenerService');
  context.spies = {
    listenerOne: context.sandbox.spy(listenerOne),
    listenerTwo: context.sandbox.spy(listenerTwo),
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
});

test.after.each((context) => {
  context.subsService.clear();
  DI.unsetAll();
});

test('should set a topic pattern', (context) => {
  assert.instance(context.subsService, SubscribeListenerService);

  context.subsService.set('^to', context.spies.listenerOne);
  context.subsService.set('topic', context.spies.listenerTwo);

  const listeners = context.subsService.find('topic');
  assert.is(listeners.length, 2);

  const listenerOne = listeners[0](context.commands.subscribe);
  const listenerTwo = listeners[1](context.commands.subscribe);

  assert.is(context.spies.listenerOne.calledOnce, true);
  assert.equal(listenerOne, { ...context.commands.subscribe, from: 'listenerOne' });
  assert.ok(context.spies.listenerOne.calledWith(context.commands.subscribe));

  assert.is(context.spies.listenerTwo.calledOnce, true);
  assert.equal(listenerTwo, { ...context.commands.subscribe, from: 'listenerTwo' });
  assert.ok(context.spies.listenerTwo.calledWith(context.commands.subscribe));
});

test('should unset a topic pattern', (context) => {
  context.subsService.set('^to', context.spies.listenerOne);
  context.subsService.set('topic', context.spies.listenerTwo);

  assert.is(context.subsService.find('topic').length, 2);

  context.subsService.unset('^to');
  assert.is(context.subsService.find('topic').length, 1);

  const listenerTwo = context.subsService.find('topic')[0](context.commands.subscribe);
  assert.is(context.spies.listenerTwo.calledOnce, true);
  assert.ok(context.spies.listenerTwo.calledWith(context.commands.subscribe));
  assert.equal(listenerTwo, { ...context.commands.subscribe, from: 'listenerTwo' });
});

test('should clear map', (context) => {
  context.subsService.set('^to', context.spies.listenerOne);
  context.subsService.set('topic', context.spies.listenerTwo);
  assert.is(context.subsService.find('topic').length, 2);

  context.subsService.clear();
  assert.is(context.subsService.find('topic').length, 0);
});

test.run();
