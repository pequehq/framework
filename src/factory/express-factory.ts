import { Server } from '../..';
import { ServerOptions } from '../models/_index';
import * as clusterUtils from '../utils/cluster.utils';

export class ExpressFactory {
  static createServer = async (options: ServerOptions) => {
    if (options.isCpuClustered && clusterUtils.isMaster()) {
      clusterUtils.setupWorkers();
    } else {
      const app = new Server(options).bootstrap();

      const port = options.port || 8888;
      const hostname = options.hostname || 'localhost';
      const expressServer = app.listen(port, hostname, () => {
        console.info(`\n`);
        console.info(`Server is running @${hostname}:${port}`);
        console.info(`CPU Clustering is ${options.isCpuClustered ? 'ON' : 'OFF'}`);
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
    }
  };
}
