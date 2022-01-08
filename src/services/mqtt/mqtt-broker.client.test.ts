import mqtt from 'mqtt';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { MqttBrokerClient, MqttSubscribePayload } from './mqtt-broker.client';

const test = suite('MQTT Broker Client');

test.before.each(async (context) => {
  context.sandbox = sinon.createSandbox();
});

test.after.each((context) => {
  context.sandbox.restore();
});

test('should call connect', async (context) => {
  const onSpy = context.sandbox.spy((event: string, cb: () => void) => cb());
  const mqttConnectStub = context.sandbox.stub(mqtt, 'connect').returns({
    on: onSpy,
  });

  const client = new MqttBrokerClient('mqtt://localhost:1883');
  await client.connect();

  assert.is(mqttConnectStub.called, true);
  assert.is(onSpy.called, true);
});

test('should call subscribe', async (context) => {
  const subscribeFunctionSpy = context.sandbox.spy((event: MqttSubscribePayload) => event);
  const onSpy = context.sandbox.spy((event: string, cb: () => void) => cb());
  const subscribeSpy = context.sandbox.spy((topic: string, err: (err: string) => void) => err('err'));
  context.sandbox.stub(mqtt, 'connect').returns({
    subscribe: subscribeSpy,
    on: onSpy,
  });

  const client = new MqttBrokerClient('mqtt://localhost:1883');
  await client.connect();

  client.subscribe(subscribeFunctionSpy);

  assert.is(subscribeSpy.called, true);
  assert.is(onSpy.called, true);
  assert.is(subscribeFunctionSpy.called, true);
});

test('should call publish with resolve', async (context) => {
  const onSpy = context.sandbox.spy((event: string, cb: () => void) => cb());
  const publishSpy = context.sandbox.spy(
    (topic: string, message: string, cb: (error: string | undefined, packet: string) => void) =>
      cb(undefined, 'packet'),
  );

  context.sandbox.stub(mqtt, 'connect').returns({
    publish: publishSpy,
    on: onSpy,
  });

  const client = new MqttBrokerClient('mqtt://localhost:1883');
  await client.connect();
  await client.publish({ topic: 'topic', payload: 'payload' });

  assert.is(publishSpy.called, true);
});

test('should call publish with reject', async (context) => {
  const onSpy = context.sandbox.spy((event: string, cb: () => void) => cb());
  const publishSpy = context.sandbox.spy(
    (topic: string, message: string, cb: (error: string | undefined, packet: string) => void) => cb('error', 'packet'),
  );

  context.sandbox.stub(mqtt, 'connect').returns({
    publish: publishSpy,
    on: onSpy,
  });

  const client = new MqttBrokerClient('mqtt://localhost:1883');
  await client.connect();

  try {
    await client.publish({ topic: 'topic', payload: 'payload' });
    assert.unreachable('should have thrown');
  } catch (error) {
    assert.is(error, 'error');
  }

  assert.is(publishSpy.called, true);
});

test.run();
