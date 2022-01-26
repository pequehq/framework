import { EventService, IPublishCommand } from 'peque-smb-commons/src';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { DI, loadProviders, wait } from '../../test/test.utils';
import { PublishCommand } from './publish.command';

const test = suite('Publish Command');

test.before.each((context) => {
  context.sandbox = sinon.createSandbox();
  context.spies = {
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
  context.events = DI.get<EventService>('EventService');
});

test.after.each((context) => {
  context.sandbox.restore();
  DI.unsetAll();
});

test('should publish a command', async (context) => {
  assert.is(context.spies.eventOn.calledOnce, true);

  context.events.next('publish', context.commands.publish);

  await wait();

  assert.is(context.spies.eventNext.callCount, 2);
  assert.ok(context.spies.eventNext.calledWith('outgoingCommand', context.commands.publish));
});

test.run();
