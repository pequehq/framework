import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { CompleteTransportQueueItem } from '../../../models';
import { KafkaBrokerClient, KafkaConsumePayload } from '../../kafka/kafka-broker.client';
import { KafkaGateway, KafkaGatewayService } from './kafka-gateway.service';

const test = suite('Kafka Microservice Gateway');

test.before.each((context) => {
  context.sandbox = sinon.createSandbox();
});

test.after.each((context) => {
  context.sandbox.restore();
});

test('should call the register correctly', async (context) => {
  const kafkaClientConnectStub = context.sandbox.stub(KafkaBrokerClient.prototype, 'connect');

  await KafkaGateway.register({ broker: 'localhost:9092', transport: 'kafka' });
  assert.is(kafkaClientConnectStub.called, true);
});

test('should call the subscribe correctly', (context) => {
  const cb: KafkaConsumePayload = { topic: 'text_event', message: new Buffer(`{ "data": "test" }`) };
  const kafkaClientSubscribeStub = context.sandbox.stub(KafkaBrokerClient.prototype, 'subscribe').callsArgWith(0, cb);

  const client = new KafkaBrokerClient('localhost:9092');

  KafkaGateway.subscribe(client);
  assert.is(kafkaClientSubscribeStub.called, true);
});

test('should call the publish correctly', async (context) => {
  const event: CompleteTransportQueueItem = {
    event: 'test_event',
    data: { test: 'data', timestamp: Date.now() },
    transport: 'kafka',
    broker: 'localhost:9092',
    timestamp: Date.now(),
    id: 'id',
    retry: 0,
  };
  const kafkaClientPublishStub = context.sandbox.stub(KafkaBrokerClient.prototype, 'publish');
  const kafkaGatewaySpy = context.sandbox.spy(KafkaGatewayService.prototype, 'successPublish');
  const client = new KafkaBrokerClient('localhost:9092');

  await KafkaGateway.publish(client, event);
  assert.is(kafkaClientPublishStub.called, true);
  assert.ok(kafkaGatewaySpy.calledWith(event));
});

test('should call the publish and throw', async (context) => {
  const event: CompleteTransportQueueItem = {
    event: 'test_event',
    data: { test: 'data', timestamp: Date.now() },
    transport: 'kafka',
    broker: 'localhost:9092',
    timestamp: Date.now(),
    id: 'id',
    retry: 0,
  };
  const kafkaClientPublishStub = context.sandbox.stub(KafkaBrokerClient.prototype, 'publish').throws();
  const kafkaGatewaySpy = context.sandbox.spy(KafkaGatewayService.prototype, 'failedPublish');
  const client = new KafkaBrokerClient('mqtt://localhost:1883');

  await KafkaGateway.publish(client, event);
  assert.is(kafkaClientPublishStub.called, true);
  assert.ok(kafkaGatewaySpy.calledWith(event));
});

test.run();
