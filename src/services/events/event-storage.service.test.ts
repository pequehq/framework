import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { EventStorage } from './event-storage.service';

const test = suite('EventStorageService');

test('should set event listener', () => {
  const methodOne = () => 'value 1';
  const methodTwo = () => 'value 2';
  EventStorage.add('testMethodOne', methodOne);
  EventStorage.add('testMethodTwo', methodTwo);

  const event = EventStorage.get('testMethodOne');
  assert.is(EventStorage.get('testMethodOne').length, 1);
  assert.is(event[0].listener(), 'value 1');
  assert.is(EventStorage.getAll().length, 2);
});

test('should remove event listener', () => {
  EventStorage.remove('testMethodOne');
  assert.is(EventStorage.get('testMethodOne').length, 0);

  EventStorage.remove('testMethodTwo');
  assert.is(EventStorage.getAll().length, 0);
});

test.run();
