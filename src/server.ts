import express, { Application } from 'express';
import { Request, Response } from 'express';
import { ControllerDefinition, ServerOptions } from './models/_index';
import { DECORATORS } from './models/constants/decorators';
import { RouteDefinition } from './models/_index';
import { buildParameters } from './utils/express/factory';
import { httpResponse } from './utils/http.utils';
import { fallback } from './middlewares/_index';
import { pushHttpEvents } from './middlewares/_index';
import { getClassDependencies, loadInjectables } from './utils/dependencies.utils';
import { Controllers } from './models/dependency-injection/controller.service';
import { errorHandler, logError } from './middlewares/error-handler.middleware';
import { SwaggerFactory } from './factory/swagger-factory';
import $RefParser from '@apidevtools/json-schema-ref-parser';
import YAML from 'yamljs';
import { getPath } from './utils/fs.utils';
import swaggerUi from 'swagger-ui-express';
import { LoggerService } from './services/logger/logger.service';
import { Inject } from './decorators/injectable';

export interface GlobalMiddlewares {
  preRoutes?: any[];
  postRoutes?: any[];
}

export class Server {
  private controllers: any;

  @Inject('LoggerService')
  private logService: LoggerService;

  constructor(private options: ServerOptions) {
  }

  logger() {
    return this.logService;
  }

  async bootstrap(): Promise<Application> {
    // Load injectables and controllers.
    Server.loadInjectables();
    this.loadControllers();

    // Load existing app or one from scratch.
    this.options.existingApp = this.options.existingApp ? this.options.existingApp : express();

    // Push HTTP event.
    this.options.existingApp.use(pushHttpEvents);

    // Add pre-route Middlewares.
    this.addMiddlewares(this.options.globalMiddlewares.preRoutes);

    // Iterate controllers.
    this.controllers.forEach(controller => {
      const instance = new controller(...getClassDependencies(controller));
      const controllerMeta: ControllerDefinition = Reflect.getMetadata(
        DECORATORS.metadata.CONTROLLER,
        controller
      );
      const routes: RouteDefinition[] = Reflect.getMetadata(
        DECORATORS.metadata.ROUTES,
        controller
      );

      // Controller root middlewares.
      if (controllerMeta.middlewares.length > 0) {
        this.options.existingApp.use(
          controllerMeta.prefix,
          ...controllerMeta.middlewares
        );
      }

      // Iterate the routes for express registration.
      routes.forEach(async route => {
        if (!route.documentOnly) {
          this.logService.log({ level: 'info', data: `[${route.requestMethod}] ${controllerMeta.prefix}${route.path}`});
          let functionToExecute = httpResponse(
            (req: Request, res: Response) => {
              const args = buildParameters(req, res, route);
              return instance[route.method.name](...args);
            }
          );

          if (route.noRestWrapper) {
            functionToExecute = (req: Request, res: Response) => {
              const args = buildParameters(req, res, route);
              return instance[route.method.name](...args);
            };
          }

          const middlewares = [...route.middlewareFunctions];
          this.options.existingApp[route.requestMethod](
            controllerMeta.prefix + route.path,
            middlewares,
            functionToExecute
          );
        }
      });
    });

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
    this.controllers = Controllers.getAll();
  }

  private static loadInjectables() {
    loadInjectables();
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
