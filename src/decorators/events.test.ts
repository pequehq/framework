import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { DECORATORS } from '../models/constants/decorators';
import { NATIVE_SERVICES } from '../models/constants/native-services';
import { Injector } from '../models/dependency-injection/injector.service';
import { EventManagerService } from '../services/events/event-manager.service';
import { loadInjectables } from '../utils/dependencies.utils';
import { OnEvent } from './events';

const test = suite('OnEvent');

test.before(async () => {
  await loadInjectables();
});

test('should add event metadata to the method where it is applied', async () => {
  Injector.setNative(NATIVE_SERVICES.EVENT_MANAGER, new EventManagerService(), [], false);

  class TestClass {
    @OnEvent('testEvent')
    testMethod() {
      console.log('test');
    }
  }

  const metadata = Reflect.getMetadata(DECORATORS.metadata.events.ON_EVENT, EventManagerService);

  console.log(metadata); // @FIXME should not be undefined
  assert.is.not(metadata, undefined);
});

test.run();
