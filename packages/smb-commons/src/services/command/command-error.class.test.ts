import { wait } from 'peque-test';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { DI, loadProviders } from '../../../test/test.utils';
import { EventService } from '../events/event.service';
import { CommandError } from './command-error.class';

const test = suite('Command Error');

test.before.each((context) => {
  context.sandbox = sinon.createSandbox();
  context.spies = {
    eventOn: context.sandbox.spy(EventService.prototype, 'on'),
    eventNext: context.sandbox.spy(EventService.prototype, 'next'),
  };

  loadProviders();
  context.error = DI.get<CommandError>('CommandError');
  context.events = DI.get<EventService>('EventService');
});

test.after.each((context) => {
  context.sandbox.restore();
  DI.unsetAll();
});

test('should consume error command', async (context) => {
  context.error.init();
  assert.is(context.spies.eventOn.calledOnce, true);

  context.events.next('error', 'test error');

  await wait();

  assert.is(context.spies.eventOn.callCount, 1);
  assert.ok(context.spies.eventNext.calledWith('error', 'test error'));
});

test.run();
