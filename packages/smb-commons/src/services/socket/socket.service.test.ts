import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { DI, loadProviders } from '../../../test/utils';
import { BrokerSocket } from '../../models';
import { SocketService } from './socket.service';

const test = suite('Socket Service');

test.before.each((context) => {
  context.sandbox = sinon.createSandbox();
  context.sandbox.stub(BrokerSocket.prototype, 'destroy');

  loadProviders();

  context.sockets = DI.get<SocketService>('SocketService');
});

test.after.each((context) => {
  context.sockets.closeAll();
  context.sandbox.restore();
  DI.unsetAll();
});

test('should set sockets', (context) => {
  const socketOne = (new BrokerSocket().id = 'id_1');

  context.sockets.set('id_1', socketOne);

  assert.is(context.sockets.has('id_1'), true);
  assert.is(context.sockets.get('id_1'), socketOne);
});

test.run();
