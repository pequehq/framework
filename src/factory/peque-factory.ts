import http from 'http';

import { ServerOptions } from '../models';
import { Server } from '../server';
import { LifeCycleManager } from '../services/life-cycle/life-cycle.service';
import { clusterUtils } from '../utils/cluster.utils';

export class PequeFactoryService {
  private expressServer: http.Server;

  async createServer(options: ServerOptions): Promise<http.Server> {
    if (options.isCpuClustered && clusterUtils.isMaster()) {
      clusterUtils.setupWorkers();
      return this.expressServer;
    }

    await LifeCycleManager.triggerServerBootstrap();
    const server = new Server(options);
    await server.bootstrap();

    this.expressServer = server.getServer();
    return this.expressServer;
  }
}

export const PequeFactory = new PequeFactoryService();
