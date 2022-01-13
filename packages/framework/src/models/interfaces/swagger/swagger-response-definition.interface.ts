export interface SwaggerResponseDefinition {
  content: string;
  description: string;
  statusCode: number;
  object: any;
  refPath: string;
  auth?: boolean;
  example?: string;
}
