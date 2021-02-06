import { Server } from '../..';
import { ServerOptions } from '../models';
import * as clusterUtils from '../utils/cluster.utils';

export class ExpressFactory {
  static createServer = async (options: ServerOptions) => {
    if (options.isCpuClustered && clusterUtils.isMaster()) {
      clusterUtils.setupWorkers();
    } else {
      const app = new Server(options).bootstrap();

      const expressServer = app.listen(
        options.port || 8888,
        options.hostname || 'localhost',
        () => {
          console.log('Server is running');
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
