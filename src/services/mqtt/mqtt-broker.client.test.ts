import mqtt from 'mqtt';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { MqttBrokerClient } from './mqtt-broker.client';

const test = suite('MQTT Broker Client');

test.before.each((context) => {
  context.sandbox = sinon.createSandbox();
});

test.after.each((context) => {
  context.sandbox.restore();
});

test('should call connect', async (context) => {
  const onSpy = context.sandbox.spy((event: string, cb: () => void) => cb());
  const mqttConnectStub = context.sandbox.stub(mqtt, 'connect').returns({ on: onSpy });

  const client = new MqttBrokerClient('mqtt://localhost:1883');
  await client.connect();

  assert.is(mqttConnectStub.called, true);
  assert.is(onSpy.called, true);
});

test.run();
