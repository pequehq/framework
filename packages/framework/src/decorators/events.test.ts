import 'reflect-metadata';

import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { wait } from '../../test/test.utils';
import { OnEventInterface } from '../models';
import { DECORATORS } from '../models/constants/decorators';
import { EventStorage } from '../services/events/event-storage.service';
import { Subjects } from '../services/subjects/subjects';
import { ConsumeEvent, ProduceEvent } from './events';

const test = suite('Events');

test.before.each(async () => {
  EventStorage.removeAll();
});

test('should set event listener metadata', () => {
  class TestClass {
    @ConsumeEvent('testEvent', 'internal')
    testMethod(): string {
      return 'value';
    }

    @ConsumeEvent('testEvent')
    testNoTransportMethod(): string {
      return 'value no transport';
    }
  }
  const eventsInternal: OnEventInterface[] = EventStorage.get({ event: 'testEvent', transport: 'internal' });
  assert.is(eventsInternal.length, 1);
  assert.is(eventsInternal[0].listener(), 'value');

  const eventsNoTransport = Reflect.getMetadata(DECORATORS.metadata.events.METHODS_CB, TestClass);
  assert.is(eventsNoTransport.length, 1);
});

test('should push and event', async () => {
  class TestClass {
    @ProduceEvent('testEvent', 'internal')
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
  assert.ok(nextSpy.calledWith({ event: { event: 'testEvent', transport: 'internal' }, data: 'value' }));

  nextSpy.restore();
});

test.run();
