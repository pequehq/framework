import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { EventStorage, OnEventInterface } from '../services/events/event-storage.service';
import { Subjects } from '../services/subjects/subjects';
import { loadInjectables } from '../utils/dependencies.utils';
import { ConsumeEvent, ProduceEvent } from './events';

const test = suite('Events');

test.before(async () => {
  await loadInjectables();
});

test.after.each(async () => {
  EventStorage.remove('testEvent');
});

test('should set event listener metadata', () => {
  class TestClass {
    @ConsumeEvent('testEvent')
    testMethod(): string {
      return 'value';
    }
  }

  const events: OnEventInterface[] = EventStorage.get('testEvent');
  assert.is(events.length, 1);
  assert.is(events[0].listener(), 'value');
});

test('should push and event', () => {
  class TestClass {
    @ProduceEvent('testEvent')
    testMethod(): string {
      return 'value';
    }
  }

  const testClass = new TestClass();

  Subjects.pushEventSubject.asObservable().subscribe((value) => {
    assert.equal(value, { event: 'testEvent', data: 'value' });
  });

  testClass.testMethod();
});

test.run();
