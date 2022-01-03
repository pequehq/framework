import { GuardClass, InterceptorClass, MiddlewareClass } from './interfaces/types';

export interface ControllerDefinition {
  prefix: string;
  middlewares: MiddlewareClass[];
  guards: GuardClass[];
  interceptors: InterceptorClass[];
}
