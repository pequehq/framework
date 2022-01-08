import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ServerOptions } from '../models';
import { CONFIG_STORAGES } from '../models/constants/config';
import { Server } from '../server';
import { Config } from '../services/config/config.service';
import { LifeCycleManager } from '../services/life-cycle/life-cycle.service';
import { clusterUtils } from '../utils/cluster.utils';
import { PequeFactory } from './peque-factory';

interface Context {
  sandbox: sinon.SinonSandbox;
}

const test = suite<Context>('ExpressFactory');

test.before.each((context) => {
  context.sandbox = sinon.createSandbox();
});

test.after.each((context) => {
  context.sandbox.restore();
});

test('should boot the server', async (context) => {
  // stub dependencies
  const triggerServerBootstrap = context.sandbox.stub(LifeCycleManager, 'triggerServerBootstrap');
  const configSet = context.sandbox.stub(Config, 'set');
  const serverBootstrap = context.sandbox.stub(Server.prototype, 'bootstrap');
  const getServer = context.sandbox.stub(Server.prototype, 'getServer');

  class RootModule {}

  const options: ServerOptions = {
    rootModule: RootModule,
  };

  await PequeFactory.createServer(options);

  assert.ok(triggerServerBootstrap.called);
  assert.ok(configSet.calledWith(CONFIG_STORAGES.EXPRESS_SERVER, options));
  assert.ok(serverBootstrap.called);
  assert.ok(getServer.called);
});

test('should call clusterUtils.setupWorkers() when is CPU clustered', async (context) => {
  context.sandbox.stub(clusterUtils, 'isMaster').returns(true);
  context.sandbox.stub(Server.prototype, 'closeServer');

  const setupWorkers = context.sandbox.stub(clusterUtils, 'setupWorkers');

  class RootModule {}

  await PequeFactory.createServer({
    rootModule: RootModule,
    isCpuClustered: true,
  });

  assert.is(setupWorkers.callCount, 1);
});

test.run();
