import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { EventStorage } from './event-storage.service';

const test = suite('EventStorageService');

test('should set event listener', () => {
  const methodOne = () => 'value 1';
  const methodTwo = () => 'value 2';
  EventStorage.add({ event: 'testMethodOne', transport: 'internal' }, methodOne);
  EventStorage.add({ event: 'testMethodTwo', transport: 'internal' }, methodTwo);

  const event = EventStorage.get({ event: 'testMethodOne', transport: 'internal' });
  assert.is(EventStorage.get({ event: 'testMethodOne', transport: 'internal' }).length, 1);
  assert.is(event[0].listener(), 'value 1');
  assert.is(EventStorage.getAll().length, 2);
});

test('should remove event listener', () => {
  EventStorage.remove({ event: 'testMethodOne', transport: 'internal' });
  assert.is(EventStorage.get({ event: 'testMethodOne', transport: 'internal' }).length, 0);

  EventStorage.remove({ event: 'testMethodTwo', transport: 'internal' });
  assert.is(EventStorage.getAll().length, 0);
});

test.run();
