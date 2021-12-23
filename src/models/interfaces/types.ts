import type { Handler } from 'express';

export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}
export type MiddlewareHandler = Handler | Handler[];
export type ExpressMethods = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'options';
export type ParamType = 'body' | 'header' | 'param' | 'query' | 'request' | 'response' | 'cookies' | 'session';
export type SwaggerParamType = 'string' | 'number' | 'array' | 'object' | 'boolean';
export type LogLevelsType = 'debug' | 'info' | 'warn' | 'error';
export type NativeEventsType =
  | 'lifecycle.bootstrap'
  | 'lifecycle.init.provider'
  | 'lifecycle.init.module'
  | 'lifecycle.init.controller'
  | 'lifecycle.init.websocket'
  | 'lifecycle.server.listening'
  | 'lifecycle.server.started'
  | 'lifecycle.destroy.controller'
  | 'lifecycle.destroy.websocket'
  | 'lifecycle.destroy.module'
  | 'lifecycle.destroy.provider'
  | 'lifecycle.server.listening.stop'
  | 'lifecycle.server.shutdown'
  | 'lifecycle.uncaught.exception'
  | 'lifecycle.uncaught.rejection'
  | 'http'
  | 'logger';

export type ClassDeclaration = Type<any>;

export type ModuleClass = ClassDeclaration;
export type ModuleInstance = InstanceType<ModuleClass>;

export type ProviderClass = ClassDeclaration;
export type ProviderInstance = InstanceType<ProviderClass>;

export type ControllerClass = ClassDeclaration;
export type ControllerInstance = InstanceType<ControllerClass>;

export type GuardClass = ClassDeclaration;
export type GuardInstance = InstanceType<GuardClass>;

export type WebSocketClass = ClassDeclaration;
export type WebSocketInstance = InstanceType<WebSocketClass>;

export type WebSocketAdapterClass = ClassDeclaration;
