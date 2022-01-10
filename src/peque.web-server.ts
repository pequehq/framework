import $RefParser from '@apidevtools/json-schema-ref-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import expressSession from 'express-session';
import http from 'http';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import { Inject } from './decorators';
import { SwaggerFactory } from './factory/swagger-factory';
import { fallback, pushHttpEvents } from './middlewares';
import { errorHandler } from './middlewares/error-handler.middleware';
import { guardHandler } from './middlewares/guard.middleware';
import { GuardClass, WebServerOptions } from './models';
import { CONFIG_STORAGES } from './models/constants/config';
import { Controllers } from './models/dependency-injection/controller.service';
import { Injector } from './models/dependency-injection/injector.service';
import { Modules } from './models/dependency-injection/module.service';
import { WebSockets } from './models/dependency-injection/websockets.service';
import { PequeBase, UpDown } from './peque.base';
import { LoggerService } from './services';
import { Config } from './services/config/config.service';
import { LifeCycleManager } from './services/life-cycle/life-cycle.service';
import { Sockets } from './services/socket/socket.service';
import { clusterUtils } from './utils/cluster.utils';
import { getPath } from './utils/fs.utils';

export class PequeWebServer extends PequeBase {
  readonly #options: WebServerOptions;

  @Inject('LoggerService')
  private logService: LoggerService;

  #application: Application;
  #server: http.Server;
  #started = false;

  constructor(options: WebServerOptions) {
    super();

    this.#options = options;
    Config.set(CONFIG_STORAGES.EXPRESS_SERVER, options);
  }

  async start(): Promise<void> {
    if (this.#options.isCpuClustered && clusterUtils.isMaster()) {
      clusterUtils.setupWorkers();
      return;
    }

    if (this.#started) {
      return;
    }

    await this.initialize();

    await LifeCycleManager.triggerServerBootstrap();

    await this.#modules().up();

    // Load existing app or one from scratch.
    this.#application = this.#options.existingApp ?? express();

    // Session.
    if (this.#options.session) {
      this.#application.use(expressSession(this.#options.session));
    }

    // Body parser.
    this.#application.use(express.json({ limit: '2m' }));
    this.#application.use(express.urlencoded({ extended: true }));

    // Cookie parser.
    this.#application.use(cookieParser());

    // CORS.
    if (this.#options.cors) {
      if (typeof this.#options.cors === 'boolean') {
        this.#application.use(cors());
      } else {
        this.#application.use(cors(this.#options.cors));
      }
    }

    // Global guards.
    if (this.#options.guards?.length) {
      this.#application.use(
        this.#options.guards.map((guard) => guardHandler(Injector.resolve<GuardClass>('injectable', guard.name))),
      );
    }

    // Push HTTP event.
    this.#application.use(pushHttpEvents);

    // Add pre-route Middlewares.
    for (const middleware of this.#options.globalMiddlewares?.preRoutes ?? []) {
      this.#application.use(middleware);
    }

    await this.#controllers().up();
    await this.#websockets().up();

    // OpenAPI.
    if (this.#options.swagger) {
      SwaggerFactory.generate();
      const swaggerDocument = await $RefParser.dereference(
        YAML.parse(getPath('../swagger/generated/base-swagger-doc.yaml')),
      );
      this.#application.use(this.#options.swagger.folder, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
      this.logService.log({ level: 'info', data: `[openapi] ${this.#options.swagger.folder}` });
    }

    // Add fallback for not existing routes.
    this.#application.use(fallback);

    // Add post-route Middlewares.
    for (const middleware of this.#options.globalMiddlewares?.postRoutes ?? []) {
      this.#application.use(middleware);
    }

    // Add general error handling.
    this.#application.use(errorHandler);

    // Server listener.
    await this.#startListening();

    this.#started = true;
  }

  async stop(exit = true): Promise<void> {
    await this.#controllers().down();
    await this.#websockets().down();
    await this.#modules().down();

    await this.#stopListening();

    await LifeCycleManager.triggerServerShutdown();
    await this.teardown();

    /* c8 ignore next */
    if (exit) {
      process.exit(0);
    }
  }

  async #startListening(): Promise<void> {
    const port = this.#options.port || 8888;
    const hostname = this.#options.hostname || 'localhost';

    await LifeCycleManager.triggerServerListen();

    this.#server = this.#application.listen(port, hostname, async () => {
      this.logService.log({ level: 'debug', data: `Server is running @${hostname}:${port}` });
      this.logService.log({
        level: 'debug',
        data: `CPU Clustering is ${this.#options.isCpuClustered ? 'ON' : 'OFF'}`,
      });

      await LifeCycleManager.triggerServerStarted();
    });

    // Connections management.
    this.#server.on('connection', (socket) => {
      this.#server.once('close', () => Sockets.delete('http', socket));
      Sockets.set('http', socket);
    });
  }

  async #stopListening(): Promise<void> {
    // Ending all the open connections first.
    Sockets.closeAllByType('http');

    this.#server.close(async (error) => {
      if (error) {
        throw error;
      }

      await LifeCycleManager.triggerServerListenStop();
    });
  }

  #controllers(): UpDown {
    return {
      up: async (): Promise<void> => {
        await Controllers.initControllers(this.#application);
      },
      down: async (): Promise<void> => {
        await Controllers.destroyControllers();
      },
    };
  }

  #modules(): UpDown {
    return {
      up: async (): Promise<void> => {
        await Modules.initModules();
      },
      down: async (): Promise<void> => {
        await Modules.destroyModules();
      },
    };
  }

  #websockets(): UpDown {
    return {
      up: async (): Promise<void> => {
        await WebSockets.initWebSockets();
      },
      down: async (): Promise<void> => {
        await WebSockets.destroyWebSockets();
      },
    };
  }

  override async onTermination(): Promise<void> {
    await this.stop();
  }

  override async onUncaughtException(error: Error): Promise<void> {
    await LifeCycleManager.triggerUncaughtException(error);

    await super.onUncaughtException(error);
  }

  override async onUnhandledRejection(error: Error): Promise<void> {
    await LifeCycleManager.triggerUncaughtRejection(error);

    await super.onUncaughtException(error);
  }
}
