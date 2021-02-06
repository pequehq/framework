import { SwaggerResponseDefinition } from './swagger-response-definition.interface';
import { RouteDefinition } from '../route-definition.interface';
import { RouteOptions } from '../route-options';

export interface SwaggerRouteDefinition {
  responses: SwaggerResponseDefinition[];
  options: RouteOptions;
  route: RouteDefinition;
}
