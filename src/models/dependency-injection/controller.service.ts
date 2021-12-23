import { Application, RequestHandler } from 'express';

import { guardExecutor } from '../../middlewares/guard.middleware';
import { LoggerService } from '../../services';
import { LifeCycleService } from '../../services/life-cycle/life-cycle.service';
import { getClassDependencies } from '../../utils/dependencies.utils';
import { buildParameters } from '../../utils/express/factory';
import { DECORATORS } from '../constants/decorators';
import { NATIVE_SERVICES } from '../constants/native-services';
import { ControllerDefinition } from '../controller-definition.interface';
import { CanExecute } from '../interfaces/authorization.interface';
import { RouteDefinition } from '../interfaces/route-definition.interface';
import { ServerOptions } from '../interfaces/server-options.interface';
import { Injector } from './injector.service';

type ControllerClass = { new (...args: unknown[]): unknown };

export class ControllerService {
  private controllers: ControllerClass[] = [];
  private instances: InstanceType<ControllerClass>[] = [];

  push(controller: ControllerClass): void {
    this.controllers.push(controller);
  }

  getAll(): ControllerClass[] {
    return this.controllers;
  }

  getInstances(): InstanceType<ControllerClass>[] {
    return this.instances;
  }

  async initControllers(options: ServerOptions): Promise<Application> {
    const logService = Injector.resolve<LoggerService>(NATIVE_SERVICES.LOGGER);

    if (!options.existingApp) {
      throw new Error('existingApp not defined'); // @TODO remove after existingApp refactoring
    }

    // Iterate controllers.
    for (const controller of this.controllers) {
      const instance = new controller(...getClassDependencies(controller));
      this.instances.push(instance);
      await LifeCycleService.triggerControllerInit(instance);

      const controllerMeta: ControllerDefinition = Reflect.getMetadata(DECORATORS.metadata.CONTROLLER, controller);
      const routes: RouteDefinition[] = Reflect.getMetadata(DECORATORS.metadata.ROUTES, controller);

      // Controller root guards.
      if (controllerMeta.guards?.length) {
        const guards = controllerMeta.guards.map((guard) => guardExecutor(Injector.resolve<CanExecute>(guard.name)));
        options.existingApp.use(controllerMeta.prefix, ...guards);
      }

      // Controller root middlewares.
      if (controllerMeta.middlewares?.length) {
        options.existingApp.use(controllerMeta.prefix, ...controllerMeta.middlewares);
      }

      // Iterate the routes for express registration.
      for (const route of routes) {
        if (route.documentOnly) {
          continue;
        }

        logService.log({
          level: 'debug',
          data: `[${route.requestMethod}] ${controllerMeta.prefix}${route.path}`,
        });

        const handler: RequestHandler = async (req, res): Promise<unknown | void> => {
          const result = async (): Promise<unknown> =>
            (instance as object)[route.method.name](...buildParameters(req, res, route));
          if (route.noRestWrapper) {
            return result();
          }

          try {
            const data = await result();

            res.setHeader('Content-Type', 'application/json');
            res.status((data as object)['statusCode'] ?? 200);
            res.send(data);
            res.end();
          } catch (error) {
            console.log(error); // @TODO handle error response
          }
        };

        // Applying guards and middlewares.
        let routeGuards: RequestHandler[] = [];
        let routeMiddlewares: RequestHandler[] = [];

        if (route.guards?.length) {
          routeGuards = route.guards.map((guard) => guardExecutor(Injector.resolve<CanExecute>(guard.name)));
        }

        if (route.middlewareFunctions) {
          routeMiddlewares = Array.isArray(route.middlewareFunctions)
            ? [...route.middlewareFunctions]
            : [route.middlewareFunctions];
        }

        // Route registration.
        options.existingApp[route.requestMethod](
          controllerMeta.prefix + route.path,
          routeGuards,
          routeMiddlewares,
          handler,
        );
      }
    }

    return options.existingApp;
  }

  async destroyControllers(): Promise<void> {
    for (const controller of this.instances) {
      await LifeCycleService.triggerControllerDestroy(controller);
    }
  }
}

Injector.setNative(NATIVE_SERVICES.CONTROLLER, ControllerService);
export const Controllers = Injector.resolve<ControllerService>(NATIVE_SERVICES.CONTROLLER);
