import { GuardClass, InterceptorClass, MiddlewareClass } from './types';

export interface ControllerDefinition {
  prefix: string;
  middlewares: MiddlewareClass[];
  guards: GuardClass[];
  interceptors: InterceptorClass[];
}
