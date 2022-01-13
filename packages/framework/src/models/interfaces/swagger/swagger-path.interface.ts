import { ExpressMethods } from '../types';
import { SwaggerRouteDefinition } from './swagger-route-definition.interface';

export interface SwaggerPath {
  method: ExpressMethods;
  routes: SwaggerRouteDefinition[];
}
