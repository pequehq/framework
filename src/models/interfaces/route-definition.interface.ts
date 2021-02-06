import { ExpressMethods, MiddlewareHandler } from './types';
import { MethodDefinition } from './method-definition.interface';

export interface RouteDefinition {
  path: string;
  requestMethod: ExpressMethods;
  method: MethodDefinition;
  middlewareFunctions: MiddlewareHandler[];
  documentOnly: boolean;
  noRestWrapper: boolean;
}
