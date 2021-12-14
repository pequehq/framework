import { DECORATORS } from '../models/constants/decorators';
import { ControllerDefinition } from '../models/controller-definition.interface';
import { RouteDefinition } from '../models/interfaces/route-definition.interface';

export function Guard(guard: any): MethodDecorator & ClassDecorator {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    if (descriptor) {
      const routes: RouteDefinition[] = Reflect.getMetadata(DECORATORS.metadata.ROUTES, target.constructor);
      if (routes[routes.length - 1].guards) {
        routes[routes.length - 1].guards.push(guard);
      } else {
        routes[routes.length - 1].guards = [guard];
      }
      Reflect.defineMetadata(DECORATORS.metadata.ROUTES, routes, target.constructor);
      return descriptor;
    } else {
      const controller: ControllerDefinition = Reflect.getMetadata(DECORATORS.metadata.CONTROLLER, target);
      controller.guards.push(guard);
      Reflect.defineMetadata(DECORATORS.metadata.CONTROLLER, controller, target);
      return target;
    }
  };
}
