import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { EventStorage, OnEventInterface } from '../services/events/event-storage.service';
import { loadInjectables } from '../utils/dependencies.utils';
import { OnEvent } from './events';

const test = suite('Events');

test.before(async () => {
  await loadInjectables();
});

test('should set event listener metadata', () => {
  class TestClass {
    @OnEvent('testEvent')
    testMethod(): string {
      return 'value';
    }
  }

  const events: OnEventInterface[] = EventStorage.get('testEvent');
  assert.is(events.length, 1);
  assert.is(events[0].listener(), 'value');
});

test.run();
