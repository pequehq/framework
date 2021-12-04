import express from 'express';
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

export interface GlobalMiddlewares {
  preRoutes?: any[];
  postRoutes?: any[];
}

export class Server {
  private controllers: any;

  constructor(private options: ServerOptions) {
  }

  bootstrap() {
    // Load injectables and controllers.
    this.loadInjectables();
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
          console.info(`[${route.requestMethod}] ${controllerMeta.prefix}${route.path}`);
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

  private loadInjectables() {
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
