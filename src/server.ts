import $RefParser from '@apidevtools/json-schema-ref-parser';
import cookieParser from 'cookie-parser';
import express, { Application } from 'express';
import { RequestHandlerParams } from 'express-serve-static-core';
import expressSession from 'express-session';
import http from 'http';
import { Socket } from 'net';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import { Inject } from './decorators';
import { SwaggerFactory } from './factory/swagger-factory';
import { fallback, pushHttpEvents } from './middlewares';
import { errorHandler } from './middlewares/error-handler.middleware';
import { guardHandler } from './middlewares/guard.middleware';
import { ServerOptions } from './models';
import { Controllers } from './models/dependency-injection/controller.service';
import { Injector } from './models/dependency-injection/injector.service';
import { Modules } from './models/dependency-injection/module.service';
import { Providers } from './models/dependency-injection/provider.service';
import { WebSockets } from './models/dependency-injection/websockets.service';
import { CanExecute } from './models/interfaces/authorization.interface';
import { LoggerService } from './services';
import { LifeCycleService } from './services/life-cycle/life-cycle.service';
import { destroyProviders, loadInjectables } from './utils/dependencies.utils';
import { getPath } from './utils/fs.utils';

export interface GlobalMiddlewares {
  preRoutes?: any[];
  postRoutes?: any[];
}

export class Server {
  @Inject('LoggerService')
  private logService: LoggerService;

  private application: Application;
  private server: http.Server;
  private sockets = new Set<Socket>();

  constructor(public options: ServerOptions) {
    this.setDefaultUnhandledExceptionsFallback();
  }

  logger(): LoggerService {
    return this.logService;
  }

  async terminator(): Promise<void> {
    await Server.destroyControllers();
    await Server.destroyWebSockets();
    await Server.destroyModules();
    await Server.destroyProviders();

    await Server.serverListenStop();
    await this.closeServer();

    await Server.serverShutdown();
    Server.unsetAllProviders();

    process.exit(1);
  }

  getServer(): http.Server {
    return this.server;
  }

  getOptions(): ServerOptions {
    return this.options;
  }

  terminationProcess() {
    const terminationSignals = ['SIGINT', 'SIGTERM', 'SIGBREAK', 'SIGHUP'];
    terminationSignals.forEach((element) => {
      process.on(element, async () => {
        await this.terminator();
      });
    });
  }

  async bootstrap(): Promise<Application> {
    // Set terminators.
    this.terminationProcess();

    // Load injectables and controllers.
    await Server.loadInjectables();
    await Server.loadModules();

    // Load existing app or one from scratch.
    this.application = this.options.existingApp ?? express();

    // Session.
    if (this.options.session) {
      this.application.use(expressSession(this.options.session));
    }

    // Cookie parser.
    this.application.use(cookieParser());

    // Global guards.
    const guards =
      this.options.guards?.map((guard) => guardHandler(Injector.resolve<CanExecute>('injectable', guard.name))) ?? [];
    this.application.use(...guards);

    // Push HTTP event.
    this.application.use(pushHttpEvents);

    // Add pre-route Middlewares.
    const preRoutes = this.options.globalMiddlewares?.preRoutes ?? [];
    this.addMiddlewares(preRoutes);

    this.application = await this.loadControllers();
    await Server.loadWebSockets();

    // OpenAPI.
    if (this.options.swagger) {
      const swaggerFactory = new SwaggerFactory();
      swaggerFactory.generate();
      const swaggerDocument = await $RefParser.dereference(
        YAML.parse(getPath('../swagger/generated/base-swagger-doc.yaml')),
      );
      this.application.use(this.options.swagger.folder, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
      this.logService.log({ level: 'info', data: `[openapi] ${this.options.swagger.folder}` });
    }

    // Add fallback.
    this.application.use(fallback);

    // Add post-route Middlewares.
    const postRoutes = this.options.globalMiddlewares?.postRoutes ?? [];
    this.addMiddlewares([...postRoutes]);

    // Add general error handling.
    this.application.use(errorHandler);

    // Server listener.
    await this.listen();

    return this.application;
  }

  private async listen(): Promise<void> {
    const port = this.options.port || 8888;
    const hostname = this.options.hostname || 'localhost';

    await LifeCycleService.triggerServerListen();

    this.server = this.application.listen(port, hostname, async () => {
      this.logger().log({ level: 'debug', data: `Server is running @${hostname}:${port}` });
      this.logger().log({ level: 'debug', data: `CPU Clustering is ${this.options.isCpuClustered ? 'ON' : 'OFF'}` });
      await LifeCycleService.triggerServerStarted();
    });

    // Connections management.
    this.server.on('connection', (socket) => {
      this.server.once('close', () => this.sockets.delete(socket));
      this.sockets.add(socket);
    });
  }

  async closeServer(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Ending all the open connections first.
      for (const socket of this.sockets) {
        socket.destroy();
        this.sockets.delete(socket);
      }

      this.server.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  private async loadControllers(): Promise<Application> {
    return await Controllers.initControllers(this.application);
  }

  private static async destroyControllers(): Promise<void> {
    await Controllers.destroyControllers();
  }

  private static async loadModules(): Promise<void> {
    await Modules.initModules();
  }

  private static async destroyModules(): Promise<void> {
    await Modules.destroyModules();
  }

  private static async loadWebSockets(): Promise<void> {
    await WebSockets.initWebSockets();
  }

  private static async destroyWebSockets(): Promise<void> {
    await WebSockets.destroyWebSockets();
  }

  private static async loadInjectables(): Promise<void> {
    await loadInjectables();
  }

  private static async destroyProviders(): Promise<void> {
    await destroyProviders();
  }

  private static async serverShutdown(): Promise<void> {
    await LifeCycleService.triggerServerShutdown();
  }

  private static async serverListenStop(): Promise<void> {
    await LifeCycleService.triggerServerListenStop();
  }

  private static unsetAllProviders(): void {
    Providers.unsetAll();
  }

  private addMiddlewares(middlewares: RequestHandlerParams[]): void {
    middlewares.forEach((middleware) => {
      this.options.existingApp?.use(middleware); // @TODO existingApp must be always defined
    });
  }

  private setDefaultUnhandledExceptionsFallback(): void {
    process.on('uncaughtException', async (error) => await LifeCycleService.triggerUncaughtException(error));
    process.on(
      'unhandledRejection',
      async (error: string) => await LifeCycleService.triggerUncaughtRejection(new Error(error)),
    );
  }
}
