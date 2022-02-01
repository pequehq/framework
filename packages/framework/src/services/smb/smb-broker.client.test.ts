import { BrokerClientFactory } from '@pequehq/smb-client';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { SmbBrokerClient, SmbSubscribePayload } from './smb-broker.client';

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

test.run();
