import { DECORATORS } from '../models/constants/decorators';
import { ControllerDefinition } from '../models/controller-definition.interface';
import { RouteDefinition } from '../models/interfaces/route-definition.interface';
import { GuardClass } from '../models/interfaces/types';

export const Guard = (guard: GuardClass): MethodDecorator & ClassDecorator => {
  return (target, propertyKey?, descriptor?): void => {
    const isClassDecorator = !descriptor;

    if (isClassDecorator) {
      const controller: ControllerDefinition = Reflect.getMetadata(DECORATORS.metadata.CONTROLLER, target);
      controller.guards?.push(guard);
      Reflect.defineMetadata(DECORATORS.metadata.CONTROLLER, controller, target);
    }

    const routes: RouteDefinition[] = Reflect.getMetadata(DECORATORS.metadata.ROUTES, target.constructor) ?? [];

    if (routes.length > 0) {
      const index = routes.length - 1;
      routes[index].guards ??= [];
      routes[index].guards?.push(guard);
    }

    Reflect.defineMetadata(DECORATORS.metadata.ROUTES, routes, target.constructor);
  };
};
