import { GuardClass, MiddlewareHandler } from './interfaces/types';

export interface ControllerDefinition {
  prefix: string;
  middlewares: MiddlewareHandler | MiddlewareHandler[];
  guards: GuardClass[];
}
