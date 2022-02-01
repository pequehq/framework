import { BrokerClientFactory } from '@pequehq/smb-client';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { BrokerAddressInvalidError } from '../../models';
import { SmbBrokerClient, SmbPublishPayload, SmbSubscribePayload } from './smb-broker.client';

const test = suite('SMB Broker Client');

test.before.each(async (context) => {
  context.sandbox = sinon.createSandbox();
});

test.after.each((context) => {
  context.sandbox.restore();
});

test('should call connect', async (context) => {
  const connectSpy = context.sandbox.fake();
  const brokerFactoryCreateSpy = context.sandbox.stub(BrokerClientFactory.prototype, 'createClient').returns({
    connect: connectSpy,
  });

  const client = new SmbBrokerClient('localhost:8021');
  await client.connect();

  assert.ok(brokerFactoryCreateSpy.calledOnce);
  assert.ok(connectSpy.calledOnce);
  assert.ok(connectSpy.calledWith({ host: 'localhost', port: 8021 }));
});

test('should throw on connect', async (context) => {
  const connectSpy = context.sandbox.fake();
  context.sandbox.stub(BrokerClientFactory.prototype, 'createClient').returns({
    connect: connectSpy,
  });

  const clients = [
    new SmbBrokerClient('localhost'),
    new SmbBrokerClient('localhost:abcd'),
    new SmbBrokerClient('localhost:'),
  ];

  for (const client of clients) {
    try {
      await client.connect();
      assert.unreachable();
    } catch (error) {
      assert.instance(error, BrokerAddressInvalidError);
    }
  }
});

test('should call subscribe', async (context) => {
  const payload = {
    command: 'publish',
    socketId: 'id_1',
    action: {
      topic: 'topic',
      message: 'test message',
    },
    issueTimestamp: 1234567890,
  };
  const subscribeFunctionSpy = context.sandbox.spy((event: SmbSubscribePayload) => event);
  const subscribeSpy = context.sandbox.spy((topic: string, cb: (command: unknown) => void) => cb(payload));
  context.sandbox.stub(BrokerClientFactory.prototype, 'createClient').returns({
    connect: context.sandbox.fake(),
    subscribe: subscribeSpy,
  });

  const client = new SmbBrokerClient('localhost:8021');
  await client.connect();

  client.subscribe(subscribeFunctionSpy);

  assert.ok(subscribeSpy.calledOnce);
  assert.ok(subscribeFunctionSpy.calledOnce);
  assert.ok(subscribeFunctionSpy.calledWith({ topic: payload.action.topic, data: payload.action.message }));
});

test('should call publish', async (context) => {
  const payload: SmbPublishPayload = {
    topic: 'test_topic',
    data: 'test message',
  };
  const messageSpy = context.sandbox.fake();
  context.sandbox.stub(BrokerClientFactory.prototype, 'createClient').returns({
    connect: context.sandbox.fake(),
    message: messageSpy,
  });

  const client = new SmbBrokerClient('localhost:8021');
  await client.connect();

  client.publish(payload);

  assert.ok(messageSpy.calledOnce);
  assert.ok(messageSpy.calledWith(payload.topic, payload.data));
});

test.run();
