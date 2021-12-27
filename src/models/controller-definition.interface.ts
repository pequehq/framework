import { GuardClass, InterceptorClass, MiddlewareHandler } from './interfaces/types';

export interface ControllerDefinition {
  prefix: string;
  middlewares: MiddlewareHandler[];
  guards: GuardClass[];
  interceptors: InterceptorClass[];
}
