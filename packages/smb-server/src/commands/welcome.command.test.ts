import { EventService, IWelcomeCommand } from '@peque/smb-commons';
import { wait } from '@peque/test';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { DI, loadProviders } from '../../test/test.utils';
import { WelcomeCommand } from './welcome.command';

const test = suite('Welcome Command');

test.before.each((context) => {
  context.sandbox = sinon.createSandbox();
  context.spies = {
    eventOn: context.sandbox.spy(EventService.prototype, 'on'),
    eventNext: context.sandbox.spy(EventService.prototype, 'next'),
  };
  context.commands = {
    welcome: {
      command: 'welcome',
      socketId: 'id_1',
      action: '',
      issueTimestamp: 1234567890,
    } as IWelcomeCommand,
  };

  loadProviders();
  context.welcome = DI.get<WelcomeCommand>('WelcomeCommand');
  context.events = DI.get<EventService>('EventService');
});

test.after.each((context) => {
  context.sandbox.restore();
  DI.unsetAll();
});

test('should publish a command', async (context) => {
  context.welcome.init();

  assert.is(context.spies.eventOn.calledOnce, true);

  context.events.next('welcome', context.commands.welcome);

  await wait();

  assert.is(context.spies.eventNext.callCount, 2);
  assert.ok(context.spies.eventNext.calledWith('outgoingCommand', context.commands.welcome));
});

test.run();
