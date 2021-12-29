import http from 'http';

import { ServerOptions } from '../models';
import { Server } from '../server';
import { LifeCycleService } from '../services/life-cycle/life-cycle.service';
import { isMaster, setupWorkers } from '../utils/cluster.utils';

export class ExpressFactory {
  private static expressServer: http.Server;

  static createServer = async (options: ServerOptions): Promise<http.Server> => {
    if (options.isCpuClustered && isMaster()) {
      setupWorkers();
      return ExpressFactory.expressServer;
    }

    await LifeCycleService.triggerServerBootstrap();
    const server = new Server(options);
    await server.bootstrap();

    ExpressFactory.expressServer = server.getServer();
    return ExpressFactory.expressServer;
  };
}
