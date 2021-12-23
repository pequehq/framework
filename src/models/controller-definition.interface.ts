import { GuardClass, MiddlewareHandler } from './interfaces/types';

export interface ControllerDefinition {
  prefix: string;
  middlewares: MiddlewareHandler[];
  guards: GuardClass[];
}
