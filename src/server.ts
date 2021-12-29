import $RefParser from '@apidevtools/json-schema-ref-parser';
import cookieParser from 'cookie-parser';
import express, { Application } from 'express';
import { RequestHandlerParams } from 'express-serve-static-core';
import expressSession from 'express-session';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import { Inject } from './decorators';
import { ExpressFactory } from './factory';
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
import { destroyProviders, getAllInstances, loadInjectables } from './utils/dependencies.utils';
import { getPath } from './utils/fs.utils';

export interface GlobalMiddlewares {
  preRoutes?: any[];
  postRoutes?: any[];
}

export class Server {
  @Inject('LoggerService')
  private logService: LoggerService;

  constructor(private options: ServerOptions) {
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
    await ExpressFactory.closeServer();

    await Server.serverShutdown();
    Server.unsetAllProviders();

    process.exit(1);
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
    this.options.existingApp = this.options.existingApp ?? express();

    // Session.
    if (this.options.session) {
      this.options.existingApp.use(expressSession(this.options.session));
    }

    // Cookie parser.
    this.options.existingApp.use(cookieParser());

    // Global guards.
    const guards =
      this.options.guards?.map((guard) => guardHandler(Injector.resolve<CanExecute>('injectable', guard.name))) ?? [];
    this.options.existingApp.use(...guards);

    // Push HTTP event.
    this.options.existingApp.use(pushHttpEvents);

    // Add pre-route Middlewares.
    const preRoutes = this.options.globalMiddlewares?.preRoutes ?? [];
    this.addMiddlewares(preRoutes);

    this.options.existingApp = await this.loadControllers();
    await Server.loadWebSockets();

    // OpenAPI.
    if (this.options.swagger) {
      const swaggerFactory = new SwaggerFactory();
      swaggerFactory.generate();
      const swaggerDocument = await $RefParser.dereference(
        YAML.parse(getPath('../swagger/generated/base-swagger-doc.yaml')),
      );
      this.options.existingApp.use(this.options.swagger.folder, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
      this.logService.log({ level: 'info', data: `[openapi] ${this.options.swagger.folder}` });
    }

    // Add fallback.
    this.options.existingApp.use(fallback);

    // Add post-route Middlewares.
    const postRoutes = this.options.globalMiddlewares?.postRoutes ?? [];
    this.addMiddlewares([...postRoutes]);

    // Add general error handling.
    this.options.existingApp.use(errorHandler);

    return this.options.existingApp;
  }

  private async loadControllers(): Promise<Application> {
    return await Controllers.initControllers(this.options);
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
