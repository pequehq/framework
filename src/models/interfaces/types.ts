export type MiddlewareHandler = any | any[];
export type ExpressMethods =
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete'
  | 'options';
export type ParamType =
  | 'body'
  | 'header'
  | 'param'
  | 'query'
  | 'request'
  | 'response';
export type SwaggerParamType =
  | 'string'
  | 'number'
  | 'array'
  | 'object'
  | 'boolean';
export type LogLevelsType =
  | 'debug'
  | 'info'
  | 'warn'
  | 'error';
export type NativeEventsType =
  | 'lifecycle.provider'
  | 'lifecycle.module'
  | 'lifecycle.controller'
  | 'http'
  | 'logger';
