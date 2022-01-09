import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { CompleteTransportQueueItem } from '../../../models';
import { MqttBrokerClient, MqttSubscribePayload } from '../../mqtt/mqtt-broker.client';
import { MqttGateway, MqttGatewayService } from './mqtt-gateway.service';

const test = suite('MQTT Microservice Gateway');

test.before.each((context) => {
  context.sandbox = sinon.createSandbox();
});

test.after.each((context) => {
  context.sandbox.restore();
});

test('should call the register correctly', async (context) => {
  const mqttClientConnectSpy = context.sandbox.stub(MqttBrokerClient.prototype, 'connect');

  await MqttGateway.register({ broker: 'mqtt://localhost:1883', transport: 'mqtt' });
  assert.is(mqttClientConnectSpy.called, true);
});

test('should call the register correctly', async (context) => {
  const mqttClientConnectStub = context.sandbox.stub(MqttBrokerClient.prototype, 'connect');

  await MqttGateway.register({ broker: 'mqtt://localhost:1883', transport: 'mqtt' });
  assert.is(mqttClientConnectStub.called, true);
});

test('should call the subscribe correctly', (context) => {
  const cb: MqttSubscribePayload = { topic: 'text_event', payload: `{ "data": "test" }` };
  const mqttClientSubscribeStub = context.sandbox.stub(MqttBrokerClient.prototype, 'subscribe').callsArgWith(0, cb);

  const client = new MqttBrokerClient('mqtt://localhost:1883');

  MqttGateway.subscribe(client);
  assert.is(mqttClientSubscribeStub.called, true);
});

test('should call the publish correctly', async (context) => {
  const event: CompleteTransportQueueItem = {
    event: 'test_event',
    data: { test: 'data', timestamp: Date.now() },
    transport: 'mqtt',
    destination: 'mqtt://localhost:1883',
    timestamp: Date.now(),
    id: 'id',
    retry: 0,
  };
  const mqttClientConnectStub = context.sandbox.stub(MqttBrokerClient.prototype, 'publish');
  const mqttGatewaySpy = context.sandbox.spy(MqttGatewayService.prototype, 'successPublish');
  const client = new MqttBrokerClient('mqtt://localhost:1883');

  await MqttGateway.publish(client, event);
  assert.is(mqttClientConnectStub.called, true);
  assert.ok(mqttGatewaySpy.calledWith(event));
});

test('should call the publish and throw', async (context) => {
  const event: CompleteTransportQueueItem = {
    event: 'test_event',
    data: { test: 'data', timestamp: Date.now() },
    transport: 'mqtt',
    destination: 'mqtt://localhost:1883',
    timestamp: Date.now(),
    id: 'id',
    retry: 0,
  };
  const mqttClientPublishStub = context.sandbox.stub(MqttBrokerClient.prototype, 'publish').throws();
  const mqttGatewaySpy = context.sandbox.spy(MqttGatewayService.prototype, 'failedPublish');
  const client = new MqttBrokerClient('mqtt://localhost:1883');

  await MqttGateway.publish(client, event);
  assert.is(mqttClientPublishStub.called, true);
  assert.ok(mqttGatewaySpy.calledWith(event));
});

test.run();
