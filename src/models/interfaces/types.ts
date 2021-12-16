export type MiddlewareHandler = any | any[];
export type ExpressMethods = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'options';
export type ParamType = 'body' | 'header' | 'param' | 'query' | 'request' | 'response' | 'cookies' | 'session';
export type SwaggerParamType = 'string' | 'number' | 'array' | 'object' | 'boolean';
export type LogLevelsType = 'debug' | 'info' | 'warn' | 'error';
export type NativeEventsType =
  | 'lifecycle.bootstrap'
  | 'lifecycle.init.provider'
  | 'lifecycle.init.module'
  | 'lifecycle.init.controller'
  | 'lifecycle.server.listening'
  | 'lifecycle.server.started'
  | 'lifecycle.destroy.controller'
  | 'lifecycle.destroy.module'
  | 'lifecycle.destroy.provider'
  | 'lifecycle.server.listening.stop'
  | 'lifecycle.server.shutdown'
  | 'lifecycle.uncaught.exception'
  | 'lifecycle.uncaught.rejection'
  | 'http'
  | 'logger';
