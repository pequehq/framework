import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { DECORATORS } from '../models/constants/decorators';
import { EventManagerService } from '../services/events/event-manager.service';
import { OnEvent, OnEventInterface } from './events';

const test = suite('Events');

test('should set event listener metadata', () => {
  class TestClass {
    @OnEvent('testEvent')
    testMethod() {
      return 'value';
    }
  }

  const events: OnEventInterface[] = Reflect.getMetadata(DECORATORS.metadata.events.ON_EVENT, EventManagerService);
  assert.is(events.length, 1);
});

test.run();
