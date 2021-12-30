import http from 'http';

import { ServerOptions } from '../models';
import { Server } from '../server';
import { LifeCycleManager } from '../services/life-cycle/life-cycle.service';
import { clusterUtils } from '../utils/cluster.utils';

export class ExpressFactory {
  private static expressServer: http.Server;

  static createServer = async (options: ServerOptions): Promise<http.Server> => {
    if (options.isCpuClustered && clusterUtils.isMaster()) {
      clusterUtils.setupWorkers();
      return ExpressFactory.expressServer;
    }

    await LifeCycleManager.triggerServerBootstrap();
    const server = new Server(options);
    await server.bootstrap();

    ExpressFactory.expressServer = server.getServer();
    return ExpressFactory.expressServer;
  };
}
