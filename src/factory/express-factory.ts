import * as http from 'http';
import { Socket } from 'net';

import { ServerOptions } from '../models/_index';
import { Server } from '../server';
import { LifeCycleService } from '../services/life-cycle/life-cycle.service';
import * as clusterUtils from '../utils/cluster.utils';

export class ExpressFactory {
  private static sharedOptions: ServerOptions;
  private static expressServer: http.Server;
  private static sockets = new Set<Socket>();

  static createServer = async (options: ServerOptions): Promise<http.Server> => {
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
        server.logger().log({ level: 'debug', data: `Server is running @${hostname}:${port}` });
        server.logger().log({ level: 'debug', data: `CPU Clustering is ${options.isCpuClustered ? 'ON' : 'OFF'}` });
        await LifeCycleService.triggerServerStarted();
      });

      // Connections management.
      ExpressFactory.expressServer.on('connection', (socket) => {
        ExpressFactory.expressServer.once('close', () => ExpressFactory.sockets.delete(socket));
        ExpressFactory.sockets.add(socket);
      });

      return ExpressFactory.expressServer;
    }
  };

  static getServerOptions(): ServerOptions {
    return ExpressFactory.sharedOptions;
  }

  static async closeServer(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Ending all the open connections first.
      for (const socket of ExpressFactory.sockets) {
        socket.destroy();
        ExpressFactory.sockets.delete(socket);
      }

      ExpressFactory.expressServer.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }
}
