import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { DI, loadProviders, wait } from '../../../test/test.utils';
import { EventService } from './event.service';

const test = suite('Event Service');

test.before.each((context) => {
  loadProviders();
  context.events = DI.get<EventService>('EventService');
});

test.after.each(() => {
  DI.unsetAll();
});

test('should publish and consume events', async (context) => {
  let message;
  context.events.on('message', (args) => (message = args));
  context.events.next('message', 'test message');

  await wait();

  assert.is(message, 'test message');
});

test.run();
