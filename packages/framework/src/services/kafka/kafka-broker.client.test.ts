import { Kafka } from 'kafkajs';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { KafkaBrokerClient, KafkaConsumePayload } from './kafka-broker.client';

const test = suite('Kafka Broker Client');

test.before.each(async (context) => {
  context.sandbox = sinon.createSandbox();
});

test.after.each((context) => {
  context.sandbox.restore();
});

test('should call connect', async (context) => {
  const onProducerConnectSpy = context.sandbox.spy(context.sandbox.fake());
  const onConsumerConnectSpy = context.sandbox.spy(context.sandbox.fake());

  const kafkaProducer = context.sandbox.stub(Kafka.prototype, 'producer').returns({
    connect: onProducerConnectSpy,
  });
  const kafkaConsumer = context.sandbox.stub(Kafka.prototype, 'consumer').returns({
    connect: onConsumerConnectSpy,
  });

  const client = new KafkaBrokerClient('localhost:9092');
  await client.connect();

  assert.ok(kafkaProducer.calledOnce);
  assert.ok(kafkaConsumer.calledOnce);
  assert.ok(onProducerConnectSpy.calledOnce);
  assert.ok(onConsumerConnectSpy.calledOnce);
});

test('should call subscribe', async (context) => {
  const payload = {
    topic: 'test_topic',
    message: { value: new Buffer('test_value') },
  };
  const subscribeFunctionSpy = context.sandbox.fake((event: KafkaConsumePayload) => event);
  const kafkaConsumerSubscribe = context.sandbox.fake();
  const kafkaConsumerRun = context.sandbox.fake((config) => {
    config.eachMessage(payload);
  });

  context.sandbox.stub(Kafka.prototype, 'producer').returns({
    connect: context.sandbox.fake(),
  });
  context.sandbox.stub(Kafka.prototype, 'consumer').returns({
    connect: context.sandbox.fake(),
    subscribe: kafkaConsumerSubscribe,
    run: kafkaConsumerRun,
  });

  const client = new KafkaBrokerClient('localhost:9092');
  await client.connect();

  await client.subscribe(subscribeFunctionSpy);

  assert.ok(kafkaConsumerSubscribe.calledOnce);
  assert.ok(kafkaConsumerRun.calledOnce);
  assert.ok(subscribeFunctionSpy.calledOnce);
  assert.ok(subscribeFunctionSpy.calledWith({ topic: payload.topic, message: payload.message.value }));
});

test('should call publish', async (context) => {
  const kafkaProduceSend = context.sandbox.fake();

  context.sandbox.stub(Kafka.prototype, 'producer').returns({
    connect: context.sandbox.fake(),
    send: kafkaProduceSend,
  });
  context.sandbox.stub(Kafka.prototype, 'consumer').returns({
    connect: context.sandbox.fake(),
  });

  const client = new KafkaBrokerClient('localhost:9092');
  await client.connect();

  await client.publish({ topic: 'test_topic', messages: ['test_message'] });

  assert.ok(kafkaProduceSend.calledOnce);
  assert.ok(kafkaProduceSend.calledWith({ topic: 'test_topic', messages: [{ value: 'test_message' }] }));
});

test.run();
