import express, { Application } from 'express';
import { ServerOptions } from './models/_index';
import { fallback } from './middlewares/_index';
import { pushHttpEvents } from './middlewares/_index';
import { destroyInjectables, loadInjectables } from './utils/dependencies.utils';
import { Controllers } from './models/dependency-injection/controller.service';
import { errorHandler, logError } from './middlewares/error-handler.middleware';
import { SwaggerFactory } from './factory/swagger-factory';
import $RefParser from '@apidevtools/json-schema-ref-parser';
import YAML from 'yamljs';
import { getPath } from './utils/fs.utils';
import swaggerUi from 'swagger-ui-express';
import { LoggerService } from './services/logger/logger.service';
import { Inject } from './decorators/injectable';
import { Modules } from './models/dependency-injection/module.service';
import { Injector } from './models/dependency-injection/injector.service';
import { LifeCycleService } from './services/life-cycle/life-cycle.service';

export interface GlobalMiddlewares {
  preRoutes?: any[];
  postRoutes?: any[];
}

export class Server {
  @Inject('LoggerService')
  private logService: LoggerService;

  constructor(private options: ServerOptions) {
    this.terminator();
  }

  logger() {
    return this.logService;
  }

  terminator() {
    process.on('SIGINT', args => {
      Server.destroyControllers();
      Server.destroyModules();
      Server.destroyInjectables();
      Server.serverShutdown();
      console.log(args);
      process.exit(1);
    });
  }

  async bootstrap(): Promise<Application> {
    // Load injectables and controllers.
    Server.loadInjectables();
    await Server.loadModules();

    // Load existing app or one from scratch.
    this.options.existingApp = this.options.existingApp ? this.options.existingApp : express();

    // Push HTTP event.
    this.options.existingApp.use(pushHttpEvents);

    // Add pre-route Middlewares.
    this.addMiddlewares(this.options.globalMiddlewares.preRoutes);

    this.options.existingApp = this.loadControllers();

    // OpenAPI.
    if (this.options.swagger) {
      const swaggerFactory = new SwaggerFactory();
      swaggerFactory.generate();
      const swaggerDocument =  await $RefParser.dereference(YAML.parse(getPath('../swagger/generated/base-swagger-doc.yaml')));
      this.options.existingApp.use(this.options.swagger.folder, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
      this.logService.log({ level: 'info', data: `[openapi] ${this.options.swagger.folder}` });
    }

    // Add fallback.
    this.options.existingApp.use(fallback);

    // Add post-route Middlewares.
    this.addMiddlewares([
      ...this.options.globalMiddlewares.postRoutes,
      logError,
      errorHandler,
    ]);

    this.setDefaultUnhandledExceptionsFallback();

    return this.options.existingApp;
  }

  private loadControllers() {
    return Controllers.initControllers(this.options);
  }

  private static destroyControllers() {
    Controllers.destroyControllers();
  }

  private static async loadModules() {
    await Modules.initModules();
  }

  private static destroyModules() {
    Modules.destroyModules();
  }

  private static loadInjectables() {
    loadInjectables();
  }

  private static destroyInjectables() {
    destroyInjectables();
  }

  private static serverShutdown() {
    const instances = [
      ...Controllers.getInstances(),
      ...Modules.getInstances(),
    ];
    Injector.getProviders().forEach(value => instances.push(value));
    instances.forEach(async instance => await LifeCycleService.triggerServerShutdown(instance));
  }

  private addMiddlewares(middlewares: any[]) {
    middlewares.forEach(middleware => {
      this.options.existingApp.use(middleware);
    });
  }

  private setDefaultUnhandledExceptionsFallback() {
    process.on('uncaughtException', error => console.error(error));
    process.on('unhandledRejection', error => console.error(error));
  }
}
