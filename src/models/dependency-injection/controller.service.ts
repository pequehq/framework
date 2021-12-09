import { Injector } from './injector.service';
import { NATIVE_SERVICES } from '../constants/native-services';
import { getClassDependencies } from '../../utils/dependencies.utils';
import { ControllerDefinition } from '../controller-definition.interface';
import { DECORATORS } from '../constants/decorators';
import { RouteDefinition } from '../interfaces/route-definition.interface';
import { httpResponse } from '../../utils/http.utils';
import { Request, Response } from 'express';
import { buildParameters } from '../../utils/express/factory';
import { ServerOptions } from '../interfaces/server-options.interface';
import { LoggerService } from '../../services/logger/logger.service';
import { LifeCycleService } from '../../services/life-cycle/life-cycle.service';

export class ControllerService {
  private controllers = [];
  private instances = [];

  push(controller: any) {
    this.controllers.push(controller);
  }

  getAll() {
    return this.controllers;
  }

  getInstances() {
    return this.instances;
  }

  initControllers(options: ServerOptions) {
    const logService = Injector.resolve<LoggerService>(NATIVE_SERVICES.LOGGER);

    // Iterate controllers.
    this.controllers.forEach(async controller => {
      const instance = new controller(...getClassDependencies(controller));
      this.instances.push(instance);
      await LifeCycleService.triggerControllerInit(instance);

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
        options.existingApp.use(
          controllerMeta.prefix,
          ...controllerMeta.middlewares
        );
      }

      // Iterate the routes for express registration.
      for (const route of routes) {
        if (!route.documentOnly) {
          logService.log({ level: 'debug', data: `[${route.requestMethod}] ${controllerMeta.prefix}${route.path}`});
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
          options.existingApp[route.requestMethod](
            controllerMeta.prefix + route.path,
            middlewares,
            functionToExecute
          );
        }
      }
    });
    return options.existingApp;
  }

  destroyControllers() {
    this.instances.forEach(async controller => {
      await LifeCycleService.triggerControllerDestroy(controller);
    });
  }
}

Injector.set(NATIVE_SERVICES.CONTROLLER, ControllerService);
export const Controllers = Injector.resolve<ControllerService>(NATIVE_SERVICES.CONTROLLER);
