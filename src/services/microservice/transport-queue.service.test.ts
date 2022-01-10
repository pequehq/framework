import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { wait } from '../../../test/test.utils';
import { TransportQueueItem } from '../../models';
import { TransportSubjects } from '../subjects/subjects';
import { MqttGateway } from './gateway/mqtt-gateway.service';
import { TransportQueue } from './transport-queue.service';

const test = suite<{ sandbox: sinon.SinonSandbox }>('Transport Queue');

test.before.each((context) => {
  context.sandbox = sinon.createSandbox();
  context.sandbox.stub(TransportQueue, 'intervalMilliseconds').returns(50);
});

test.after.each((context) => {
  TransportQueue.clear();
  context.sandbox.restore();
});

test.after(() => TransportQueue.stopRecycler());

test('should subscribe to the success and fail subjects', async (context) => {
  const transportFailedSubscribeSpy = context.sandbox.spy(TransportSubjects.failedTransportSubject, 'subscribe');
  const transportSuccessSubscribeSpy = context.sandbox.spy(TransportSubjects.successTransportSubject, 'subscribe');

  assert.is(transportFailedSubscribeSpy.callCount, 0);
  assert.is(transportSuccessSubscribeSpy.callCount, 0);

  TransportQueue.init();
  await wait();

  assert.is(transportFailedSubscribeSpy.callCount, 1);
  assert.is(transportSuccessSubscribeSpy.callCount, 1);
});

test('should forward an event', async (context) => {
  context.sandbox.stub(MqttGateway, 'publish');

  const event: TransportQueueItem = {
    event: 'test_event',
    data: { test: 'data', timestamp: Date.now() },
    transport: 'mqtt',
    broker: 'mqtt://localhost:1883',
    timestamp: Date.now(),
  };

  const transportSendNextSpy = context.sandbox.spy(TransportSubjects.sendTransportSubject, 'next');
  assert.is(transportSendNextSpy.callCount, 0);

  TransportQueue.init();
  await wait();

  const id = TransportQueue.sendItem(event);
  assert.is(transportSendNextSpy.callCount, 1);
  assert.ok(transportSendNextSpy.calledWith({ id, retry: 0, ...event }));
});

test.run();
