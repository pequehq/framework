import { SwaggerSecurityType } from './types';

export interface RouteOptions {
  summary: string;
  operationId: string;
  parameters: string[];
  security?: SwaggerSecurityType[];
  requestBody?: any;
  content?: string;
}
