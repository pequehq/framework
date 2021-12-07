export interface RouteOptions {
  summary: string;
  operationId: string;
  parameters: string[];
  security?: string[];
  requestBody?: any;
  content?: string;
}
