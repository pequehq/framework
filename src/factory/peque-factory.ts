import http from 'http';

import { MicroserviceClass, ServerOptions } from '../models';
import { Controllers } from '../models/dependency-injection/controller.service';
import { Modules } from '../models/dependency-injection/module.service';
import { Providers } from '../models/dependency-injection/provider.service';
import { WebSockets } from '../models/dependency-injection/websockets.service';
import { Server } from '../server';
import { TransportQueue } from '../services';
import { LifeCycleManager } from '../services/life-cycle/life-cycle.service';
import { Microservices } from '../services/microservice/microservice.service';
import { Gateways } from '../services/microservice/microservice-gateway.service';
import { clusterUtils } from '../utils/cluster.utils';
import { destroyProviders, loadProviders } from '../utils/dependencies.utils';

export class PequeFactory {
  private static server: Server;
  private static initialized = false;

  private static init = async (): Promise<void> => {
    if (PequeFactory.initialized) {
      return;
    }

    const terminationSignals = ['SIGINT', 'SIGTERM', 'SIGBREAK', 'SIGHUP'];
    terminationSignals.forEach((element) => {
      process.on(element, async () => {
        await PequeFactory.terminator();
      });
    });

    process.on('uncaughtException', async (error) => {
      await LifeCycleManager.triggerUncaughtException(error);
      console.error(error);
      process.exit(0);
    });

    process.on('unhandledRejection', async (error: string) => {
      await LifeCycleManager.triggerUncaughtRejection(new Error(error));
      console.error(error);
      process.exit(0);
    });

    TransportQueue.init();
    Gateways.startListening();
    await loadProviders();
    PequeFactory.initialized = true;
  };

  private static terminator = async (): Promise<void> => {
    await Controllers.destroyControllers();
    await WebSockets.destroyWebSockets();
    await Modules.destroyModules();
    await destroyProviders();

    await LifeCycleManager.triggerServerListenStop();
    await PequeFactory.server.closeServer();
    Gateways.stopListening();

    await LifeCycleManager.triggerServerShutdown();
    Providers.unsetAll();

    process.exit(1);
  };

  static createServer = async (options: ServerOptions): Promise<http.Server> => {
    if (options.isCpuClustered && clusterUtils.isMaster()) {
      clusterUtils.setupWorkers();
      return PequeFactory.server.getServer();
    }

    await PequeFactory.init();

    await LifeCycleManager.triggerServerBootstrap();
    const server = new Server(options);
    await server.bootstrap();

    PequeFactory.server = server;
    return server.getServer();
  };

  static createMicroservices = async (services: { services: MicroserviceClass[] }): Promise<void> => {
    await PequeFactory.init();
    await Microservices.startMicroservices();
  };
}
