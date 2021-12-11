import { ServerOptions } from '../models/_index';
import * as clusterUtils from '../utils/cluster.utils';
import { Server } from '../server';
import { LifeCycleService } from '../services/life-cycle/life-cycle.service';
import * as http from 'http';

export class ExpressFactory {
  private static sharedOptions: ServerOptions;
  private static expressServer: http.Server;

  static createServer = async (options: ServerOptions) => {
    ExpressFactory.sharedOptions = options;
    if (options.isCpuClustered && clusterUtils.isMaster()) {
      clusterUtils.setupWorkers();
    } else {
      await LifeCycleService.triggerServerBootstrap();

      const server = new Server(options);
      const app = await server.bootstrap();
      const port = options.port || 8888;
      const hostname = options.hostname || 'localhost';

      await LifeCycleService.triggerServerListen();

      ExpressFactory.expressServer = app.listen(port, hostname, async () => {
        server.logger().log({level: 'debug', data: `Server is running @${hostname}:${port}`});
        server.logger().log({level: 'debug', data: `CPU Clustering is ${options.isCpuClustered ? 'ON' : 'OFF'}`});
        await LifeCycleService.triggerServerStarted();
      });

      /*
       * Handling options.
       */
      if (options.timeout) {
        ExpressFactory.expressServer.timeout = options.timeout;
      }
      if (options.keepAliveTimeout) {
        ExpressFactory.expressServer.keepAliveTimeout = options.keepAliveTimeout;
      }
      if (options.headersTimeout) {
        ExpressFactory.expressServer.headersTimeout = options.headersTimeout;
      }

      return ExpressFactory.expressServer;
    }
  };

  static getServerOptions() {
    return ExpressFactory.sharedOptions;
  }

  static async closeServer() {
    return new Promise((resolve, reject) => {
      ExpressFactory.expressServer.close(err => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      })
    });
  }
}
