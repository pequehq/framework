import { Request, Response } from 'express';

import { guardExecutor } from '../../middlewares/guard.middleware';
import { LifeCycleService } from '../../services/life-cycle/life-cycle.service';
import { LoggerService } from '../../services/logger/logger.service';
import { getClassDependencies } from '../../utils/dependencies.utils';
import { buildParameters } from '../../utils/express/factory';
import { httpResponse } from '../../utils/http.utils';
import { DECORATORS } from '../constants/decorators';
import { NATIVE_SERVICES } from '../constants/native-services';
import { ControllerDefinition } from '../controller-definition.interface';
import { CanExecute } from '../interfaces/authorization.interface';
import { RouteDefinition } from '../interfaces/route-definition.interface';
import { ServerOptions } from '../interfaces/server-options.interface';
import { Injector } from './injector.service';

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

  async initControllers(options: ServerOptions) {
    const logService = Injector.resolve<LoggerService>(NATIVE_SERVICES.LOGGER);

    // Iterate controllers.
    for (const controller of this.controllers) {
      const instance = new controller(...getClassDependencies(controller));
      this.instances.push(instance);
      await LifeCycleService.triggerControllerInit(instance);

      const controllerMeta: ControllerDefinition = Reflect.getMetadata(DECORATORS.metadata.CONTROLLER, controller);
      const routes: RouteDefinition[] = Reflect.getMetadata(DECORATORS.metadata.ROUTES, controller);

      // Controller root guards.
      if (controllerMeta.guards.length > 0) {
        const guards =
          controllerMeta.guards?.map((guard) => guardExecutor(Injector.resolve<CanExecute>(guard.name))) || [];
        options.existingApp.use(controllerMeta.prefix, ...guards);
      }

      // Controller root middlewares.
      if (controllerMeta.middlewares.length > 0) {
        options.existingApp.use(controllerMeta.prefix, ...controllerMeta.middlewares);
      }

      // Iterate the routes for express registration.
      for (const route of routes) {
        if (!route.documentOnly) {
          logService.log({ level: 'debug', data: `[${route.requestMethod}] ${controllerMeta.prefix}${route.path}` });
          let functionToExecute = httpResponse((req: Request, res: Response) => {
            const args = buildParameters(req, res, route);
            return instance[route.method.name](...args);
          });

          if (route.noRestWrapper) {
            functionToExecute = (req: Request, res: Response) => {
              const args = buildParameters(req, res, route);
              return instance[route.method.name](...args);
            };
          }

          // Applying guards and middlewares.
          const guards = route.guards?.map((guard) => guardExecutor(Injector.resolve<CanExecute>(guard.name))) || [];
          const middlewares = [...route.middlewareFunctions];

          // Route registration.
          options.existingApp[route.requestMethod](
            controllerMeta.prefix + route.path,
            guards,
            middlewares,
            functionToExecute,
          );
        }
      }
    }
    return options.existingApp;
  }

  async destroyControllers() {
    for (const controller of this.instances) {
      await LifeCycleService.triggerControllerDestroy(controller);
    }
  }
}

Injector.setNative(NATIVE_SERVICES.CONTROLLER, ControllerService);
export const Controllers = Injector.resolve<ControllerService>(NATIVE_SERVICES.CONTROLLER);
