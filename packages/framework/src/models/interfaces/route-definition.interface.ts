import { MethodDefinition } from './method-definition.interface';
import { ExpressMethods, GuardClass, InterceptorClass, MiddlewareClass } from './types';

export interface RouteDefinition {
  path: string;
  requestMethod: ExpressMethods;
  method: MethodDefinition;
  middlewareFunctions: MiddlewareClass[];
  documentOnly: boolean;
  guards: GuardClass[];
  interceptors: InterceptorClass[];
}
