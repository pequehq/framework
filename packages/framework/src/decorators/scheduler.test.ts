import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { DECORATORS } from '../models/constants/decorators';
import { SchedulerService } from '../services';
import { Scheduler, SchedulerConfig } from './scheduler';

const test = suite('Scheduler');

test('should contain the right Scheduler metadata', async () => {
  class TestClass {
    @Scheduler('testEvent', '*/5 * * * * *')
    testMethod() {
      // empty
    }
  }

  const metadata: Map<string, SchedulerConfig> =
    Reflect.getMetadata(DECORATORS.metadata.SCHEDULER, SchedulerService) ?? new Map<string, SchedulerConfig>();

  assert.is(metadata.size, 1);
  assert.ok(metadata.has('TestClass_testMethod'));
  assert.equal(metadata.get('TestClass_testMethod'), {
    name: 'testEvent',
    cron: '*/5 * * * * *',
    listener: new TestClass().testMethod,
  });
});

test.run();
