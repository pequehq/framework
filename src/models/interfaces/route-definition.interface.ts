import { MethodDefinition } from './method-definition.interface';
import { ExpressMethods, MiddlewareHandler } from './types';

export interface RouteDefinition {
  path: string;
  requestMethod: ExpressMethods;
  method: MethodDefinition;
  middlewareFunctions: MiddlewareHandler[];
  documentOnly: boolean;
  noRestWrapper: boolean;
}
