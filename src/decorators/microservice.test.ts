import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { EventPayload } from '../models';
import { DECORATORS } from '../models/constants/decorators';
import { Injector } from '../models/dependency-injection/dependency-injection.service';
import { MicroserviceHandler } from '../services';
import { EventStorage } from '../services/events/event-storage.service';
import { loadProviders } from '../utils/dependencies.utils';
import { ConsumeEvent } from './events';
import { Microservice } from './microservice';

const test = suite('Microservice');

test.before.each(async (context) => {
  @Microservice({ broker: 'mqtt://localhost:1883', transport: 'mqtt' })
  class TestMqttMicroservice extends MicroserviceHandler {
    start(): void {
      // noop.
    }

    @ConsumeEvent('test_event')
    test(data: EventPayload<any>) {
      // noop.
    }
  }

  await loadProviders();

  context.microservice = TestMqttMicroservice;
});

test.after.each(async () => {
  try {
    await Injector.unsetAll();
  } catch (error) {
    console.error(error);
  }

  EventStorage.removeAll();
});

test('should load the correct microservice metadata', (context) => {
  assert.is(Injector.getProviderByType('microservice', context.microservice.name)?.clazz, context.microservice);
  assert.instance(Injector.resolve('microservice', context.microservice.name), context.microservice);
  assert.equal(Reflect.getMetadata(DECORATORS.metadata.microservice.OPTIONS, context.microservice), {
    broker: 'mqtt://localhost:1883',
    transport: 'mqtt',
  });
  assert.is(EventStorage.getAll().length, 1);
  assert.is(EventStorage.get({ event: 'test_event', transport: 'mqtt' }).length, 1);
});

test.run();
