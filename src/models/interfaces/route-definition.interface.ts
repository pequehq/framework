import { MethodDefinition } from './method-definition.interface';
import { ExpressMethods, GuardClass, InterceptorClass, MiddlewareHandler } from './types';

export interface RouteDefinition {
  path: string;
  requestMethod: ExpressMethods;
  method: MethodDefinition;
  middlewareFunctions: MiddlewareHandler;
  documentOnly: boolean;
  noRestWrapper: boolean;
  guards: GuardClass[];
  interceptors: InterceptorClass[];
}
