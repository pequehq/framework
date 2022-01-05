import 'reflect-metadata';

import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { wait } from '../../test/test.utils';
import { EventStorage, OnEventInterface } from '../services/events/event-storage.service';
import { Subjects } from '../services/subjects/subjects';
import { ConsumeEvent, ProduceEvent } from './events';

const test = suite('Events');

test.before.each(async () => {
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

test('should push and event', async () => {
  class TestClass {
    @ProduceEvent('testEvent')
    testMethod(): string {
      return 'value';
    }
  }

  const nextSpy = sinon.spy(Subjects.pushEventSubject, 'next');
  assert.is(nextSpy.callCount, 0);

  const testClass = new TestClass();
  testClass.testMethod();

  await wait();

  assert.is(nextSpy.callCount, 1);
  assert.ok(nextSpy.calledWith({ event: 'testEvent', data: 'value' }));

  nextSpy.restore();
});

test.run();
