import { ParamDefinition } from './param-definition.interface';

export interface MethodDefinition {
  name: string | symbol;
  body?: ParamDefinition[];
  params?: ParamDefinition[];
  query?: ParamDefinition[];
  headers?: ParamDefinition[];
  request?: ParamDefinition[];
  response?: ParamDefinition[];
}
