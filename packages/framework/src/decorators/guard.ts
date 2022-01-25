import 'reflect-metadata';

import { ControllerDefinition, GuardClass, RouteDefinition } from '../models';
import { DECORATORS } from '../models/constants/decorators';

export const Guard = (guard: GuardClass): MethodDecorator & ClassDecorator => {
  return (target, propertyKey?, descriptor?): void => {
    const isClassDecorator = !descriptor;

    if (isClassDecorator) {
      const controller: ControllerDefinition = Reflect.getMetadata(DECORATORS.metadata.CONTROLLER, target);
      controller.guards.push(guard);
      Reflect.defineMetadata(DECORATORS.metadata.CONTROLLER, controller, target);
    }

    const routes: RouteDefinition[] = Reflect.getMetadata(DECORATORS.metadata.ROUTES, target.constructor) ?? [];

    if (routes.length > 0) {
      routes[routes.length - 1].guards.push(guard);
    }

    Reflect.defineMetadata(DECORATORS.metadata.ROUTES, routes, target.constructor);
  };
};
