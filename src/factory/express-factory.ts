import { ServerOptions } from '../models/_index';
import * as clusterUtils from '../utils/cluster.utils';
import { Server } from '../server';

export class ExpressFactory {
  private static sharedOptions: ServerOptions;

  static createServer = async (options: ServerOptions) => {
    ExpressFactory.sharedOptions = options;
    if (options.isCpuClustered && clusterUtils.isMaster()) {
      clusterUtils.setupWorkers();
    } else {
      const server = new Server(options);
      const app = await server.bootstrap();
      const port = options.port || 8888;
      const hostname = options.hostname || 'localhost';

      const expressServer = app.listen(port, hostname, () => {
        server.logger().log({level: 'debug', data: `Server is running @${hostname}:${port}`});
        server.logger().log({level: 'debug', data: `CPU Clustering is ${options.isCpuClustered ? 'ON' : 'OFF'}`});
      });

      /*
       * Handling options.
       */
      if (options.timeout) {
        expressServer.timeout = options.timeout;
      }
      if (options.keepAliveTimeout) {
        expressServer.keepAliveTimeout = options.keepAliveTimeout;
      }
      if (options.headersTimeout) {
        expressServer.headersTimeout = options.headersTimeout;
      }

      return expressServer;
    }
  };

  static getServerOptions() {
    return ExpressFactory.sharedOptions;
  }
}
