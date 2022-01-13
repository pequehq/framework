import { RouteDefinition } from '../route-definition.interface';
import { RouteOptions } from '../route-options';
import { SwaggerResponseDefinition } from './swagger-response-definition.interface';

export interface SwaggerRouteDefinition {
  responses: SwaggerResponseDefinition[];
  options: RouteOptions;
  route: RouteDefinition;
}
