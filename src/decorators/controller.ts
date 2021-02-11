import { MiddlewareHandler } from '../models/_index';
import { controllerBuilder } from './utils/decorators';

export const Controller = (
  prefix = '/',
  middlewares: MiddlewareHandler = []
): ClassDecorator => {
  return controllerBuilder(prefix, middlewares);
};
