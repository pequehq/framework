import { SwaggerParamType } from '../types';

export interface SwaggerPropertyOptions {
  type: SwaggerParamType;
  required?: boolean;
  arrayType?: SwaggerParamType;
  enum?: string[];
  description?: string;
  example?: any;
  value?: any;
}
