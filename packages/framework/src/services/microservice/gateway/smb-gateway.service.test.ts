import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { CompleteTransportQueueItem } from '../../../models';
import { SmbBrokerClient, SmbPublishPayload } from '../../smb/smb-broker.client';
import { SmbGateway, SmbGatewayService } from './smb-gateway.service';

const test = suite('SMB Microservice Gateway');

test.before.each((context) => {
  context.sandbox = sinon.createSandbox();
});

test.after.each((context) => {
  context.sandbox.restore();
});

test('should call the register correctly', async (context) => {
  const smbClientConnectStub = context.sandbox.stub(SmbBrokerClient.prototype, 'connect');

  await SmbGateway.register({ broker: 'localhost:8021', transport: 'smb' });
  assert.is(smbClientConnectStub.called, true);
});

test('should call the subscribe correctly', (context) => {
  const cb: SmbPublishPayload = {
    topic: 'test_topic',
    data: `{ "data": "test" }`,
  };
  const smbClientSubscribeStub = context.sandbox.stub(SmbBrokerClient.prototype, 'subscribe').callsArgWith(0, cb);

  const client = new SmbBrokerClient('localhost:8021');

  SmbGateway.subscribe(client);
  assert.is(smbClientSubscribeStub.called, true);
});

test('should call the publish correctly', async (context) => {
  const event: CompleteTransportQueueItem = {
    event: 'test_event',
    data: { test: 'data', timestamp: Date.now() },
    transport: 'smb',
    broker: 'localhost:8021',
    timestamp: Date.now(),
    id: 'id',
    retry: 0,
  };
  const smbClientPublishStub = context.sandbox.stub(SmbBrokerClient.prototype, 'publish');
  const smbGatewaySpy = context.sandbox.spy(SmbGatewayService.prototype, 'successPublish');
  const client = new SmbBrokerClient('localhost:8021');

  await SmbGateway.publish(client, event);
  assert.is(smbClientPublishStub.called, true);
  assert.ok(smbGatewaySpy.calledWith(event));
});

test('should call the publish and throw', async (context) => {
  const event: CompleteTransportQueueItem = {
    event: 'test_event',
    data: { test: 'data', timestamp: Date.now() },
    transport: 'smb',
    broker: 'localhost:8021',
    timestamp: Date.now(),
    id: 'id',
    retry: 0,
  };
  const smbClientPublishStub = context.sandbox.stub(SmbBrokerClient.prototype, 'publish').throws();
  const smbGatewaySpy = context.sandbox.spy(SmbGatewayService.prototype, 'failedPublish');
  const client = new SmbBrokerClient('localhost:8021');

  await SmbGateway.publish(client, event);
  assert.is(smbClientPublishStub.called, true);
  assert.ok(smbGatewaySpy.calledWith(event));
});

test.run();
