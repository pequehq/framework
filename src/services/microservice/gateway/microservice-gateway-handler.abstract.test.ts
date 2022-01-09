import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { wait } from '../../../../test/test.utils';
import { CompleteTransportQueueItem, MicroserviceOptions } from '../../../models';
import { Subjects, TransportSubjects } from '../../subjects/subjects';
import { MicroserviceGatewayHandler, PushGatewayEvent } from './microservice-gateway-handler.abstract';

const test = suite('Microservice Abstract Gateway Handler');

test.before.each((context) => {
  context.sandbox = sinon.createSandbox();

  class TestGateway extends MicroserviceGatewayHandler {
    publish(client: unknown, item: CompleteTransportQueueItem): void {
      // noop.
    }

    subscribe(client: unknown): void {
      // noop.
    }

    register(options: MicroserviceOptions): unknown {
      // noop.
      return undefined;
    }
  }

  context.gateway = new TestGateway();

  const event: CompleteTransportQueueItem = {
    event: 'test_event',
    data: { test: 'data', timestamp: Date.now() },
    transport: 'mqtt',
    destination: 'mqtt://localhost:1883',
    timestamp: Date.now(),
    id: 'id',
    retry: 0,
  };

  context.event = event;
});

test.after.each((context) => {
  context.sandbox.restore();
});

test('should handle the success transport subject', (context) => {
  const transportSuccessNextSpy = context.sandbox.spy(TransportSubjects.successTransportSubject, 'next');

  assert.is(transportSuccessNextSpy.callCount, 0);

  (context.gateway as MicroserviceGatewayHandler).successPublish(context.event);
  assert.is(transportSuccessNextSpy.callCount, 1);
  assert.ok(transportSuccessNextSpy.calledWith(context.event));
});

test('should handle the failed transport subject', async (context) => {
  let eventRetry = 0;
  const transportFailedNextSpy = context.sandbox.spy(TransportSubjects.failedTransportSubject, 'next');

  assert.is(transportFailedNextSpy.callCount, 0);

  TransportSubjects.failedTransportSubject.subscribe((item) => {
    eventRetry = item.retry;
  });

  (context.gateway as MicroserviceGatewayHandler).failedPublish(context.event);
  await wait();

  assert.is(transportFailedNextSpy.callCount, 1);
  assert.ok(transportFailedNextSpy.calledWith(context.event));
  assert.is(eventRetry, 1);
});

test('should handle the event push subject', (context) => {
  const pushGatewayEvent: PushGatewayEvent = {
    event: context.event.event,
    transport: context.event.transport,
    data: JSON.stringify(context.event.data),
  };
  const subjectPushEventNextSpy = context.sandbox.spy(Subjects.pushEventSubject, 'next');

  assert.is(subjectPushEventNextSpy.callCount, 0);

  (context.gateway as MicroserviceGatewayHandler).pushEvent(pushGatewayEvent);
  assert.is(subjectPushEventNextSpy.callCount, 1);
  assert.ok(
    subjectPushEventNextSpy.calledWith({
      event: { event: pushGatewayEvent.event, transport: pushGatewayEvent.transport },
      data: JSON.parse(pushGatewayEvent.data),
    }),
  );
});

test.run();
