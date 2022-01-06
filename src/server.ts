import $RefParser from '@apidevtools/json-schema-ref-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import { RequestHandlerParams } from 'express-serve-static-core';
import expressSession from 'express-session';
import http from 'http';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import { Inject } from './decorators';
import { SwaggerFactory } from './factory/swagger-factory';
import { fallback, pushHttpEvents } from './middlewares';
import { errorHandler } from './middlewares/error-handler.middleware';
import { guardHandler } from './middlewares/guard.middleware';
import { ServerOptions } from './models';
import { CanExecute } from './models';
import { CONFIG_STORAGES } from './models/constants/config';
import { Controllers } from './models/dependency-injection/controller.service';
import { Injector } from './models/dependency-injection/injector.service';
import { Modules } from './models/dependency-injection/module.service';
import { Providers } from './models/dependency-injection/provider.service';
import { WebSockets } from './models/dependency-injection/websockets.service';
import { LoggerService } from './services';
import { Config } from './services/config/config.service';
import { LifeCycleManager } from './services/life-cycle/life-cycle.service';
import { Sockets } from './services/socket/socket.service';
import { destroyProviders, loadInjectables } from './utils/dependencies.utils';
import { getPath } from './utils/fs.utils';

export class Server {
  readonly #options: ServerOptions;

  @Inject('LoggerService')
  private logService: LoggerService;

  #application: Application;
  #server: http.Server;

  constructor(options: ServerOptions) {
    this.#options = options;
    Config.set(CONFIG_STORAGES.EXPRESS_SERVER, options);

    this.#setDefaultUnhandledExceptionsFallback();
  }

  logger(): LoggerService {
    return this.logService;
  }

  async #gracefulShutdown(): Promise<void> {
    await this.#destroyControllers();
    await this.#destroyWebSockets();
    await this.#destroyModules();
    await this.#destroyProviders();

    await this.#serverListenStop();
    await this.#closeServer();

    await this.#serverShutdown();
    this.#unsetAllProviders();

    process.exit(1);
  }

  getServer(): http.Server {
    return this.#server;
  }

  async bootstrap(): Promise<void> {
    // Set graceful shutdown.
    for (const terminationSignal of ['SIGINT', 'SIGTERM', 'SIGBREAK', 'SIGHUP']) {
      process.on(terminationSignal, this.#gracefulShutdown);
    }

    // Load injectables and controllers.
    await this.#loadInjectables();
    await this.#loadModules();

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
        this.#options.guards.map((guard) => guardHandler(Injector.resolve<CanExecute>('injectable', guard.name))),
      );
    }

    // Push HTTP event.
    this.#application.use(pushHttpEvents);

    // Add pre-route Middlewares.
    const preRoutes = this.#options.globalMiddlewares?.preRoutes ?? [];
    this.#addMiddlewares(preRoutes);

    await this.#loadControllers();
    await this.#loadWebSockets();

    // OpenAPI.
    if (this.#options.swagger) {
      const swaggerFactory = new SwaggerFactory();
      swaggerFactory.generate();
      const swaggerDocument = await $RefParser.dereference(
        YAML.parse(getPath('../swagger/generated/base-swagger-doc.yaml')),
      );
      this.#application.use(this.#options.swagger.folder, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
      this.logService.log({ level: 'info', data: `[openapi] ${this.#options.swagger.folder}` });
    }

    // Add fallback for not existing routes.
    this.#application.use(fallback);

    // Add post-route Middlewares.
    const postRoutes = this.#options.globalMiddlewares?.postRoutes ?? [];
    this.#addMiddlewares([...postRoutes]);

    // Add general error handling.
    this.#application.use(errorHandler);

    // Server listener.
    await this.#listen();
  }

  async #listen(): Promise<void> {
    const port = this.#options.port || 8888;
    const hostname = this.#options.hostname || 'localhost';

    await LifeCycleManager.triggerServerListen();

    this.#server = this.#application.listen(port, hostname, async () => {
      this.logger().log({ level: 'debug', data: `Server is running @${hostname}:${port}` });
      this.logger().log({ level: 'debug', data: `CPU Clustering is ${this.#options.isCpuClustered ? 'ON' : 'OFF'}` });
      await LifeCycleManager.triggerServerStarted();
    });

    // Connections management.
    this.#server.on('connection', (socket) => {
      this.#server.once('close', () => Sockets.delete('http', socket));
      Sockets.set('http', socket);
    });
  }

  async #closeServer(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Ending all the open connections first.
      Sockets.closeAllByType('http');

      this.#server.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  async #loadControllers(): Promise<void> {
    await Controllers.initControllers(this.#application);
  }

  async #destroyControllers(): Promise<void> {
    await Controllers.destroyControllers();
  }

  async #loadModules(): Promise<void> {
    await Modules.initModules();
  }

  async #destroyModules(): Promise<void> {
    await Modules.destroyModules();
  }

  async #loadWebSockets(): Promise<void> {
    await WebSockets.initWebSockets();
  }

  async #destroyWebSockets(): Promise<void> {
    await WebSockets.destroyWebSockets();
  }

  async #loadInjectables(): Promise<void> {
    await loadInjectables();
  }

  async #destroyProviders(): Promise<void> {
    await destroyProviders();
  }

  async #serverShutdown(): Promise<void> {
    await LifeCycleManager.triggerServerShutdown();
  }

  async #serverListenStop(): Promise<void> {
    await LifeCycleManager.triggerServerListenStop();
  }

  #unsetAllProviders(): void {
    Providers.unsetAll();
  }

  #addMiddlewares(middlewares: RequestHandlerParams[]): void {
    middlewares.forEach((middleware) => {
      this.#application.use(middleware);
    });
  }

  #setDefaultUnhandledExceptionsFallback(): void {
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
  }
}
