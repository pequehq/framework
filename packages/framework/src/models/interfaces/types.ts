export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

export type Listener = (...args: unknown[]) => void;
export type ExpressMethods = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'options';
export type ParamType = 'body' | 'header' | 'param' | 'query' | 'request' | 'response' | 'cookies' | 'session';
export type SwaggerParamType = 'string' | 'number' | 'array' | 'object' | 'boolean';
export type LogLevelsType = 'debug' | 'info' | 'warn' | 'error';
export type InterceptorType = 'exception';
export type ProviderType = 'injectable' | 'interceptor' | 'transformer' | 'middleware' | 'microservice';
export type ExternalTransportType = 'mqtt' | 'redis' | 'kafka';
export type TransportType = ExternalTransportType | 'internal';
export type LifeCycleEventsType =
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
  | 'lifecycle.uncaught.rejection';
export type NativeEventsType = 'lifecycle' | 'http' | 'logger' | 'interceptor.exception';
export type SubjectType = 'lifeCycleSubject' | 'pushEventSubject';
export type TransportSubjectType = 'sendTransportSubject' | 'failedTransportSubject' | 'successTransportSubject';
export type InterceptorStage = 'after' | 'before' | 'error';

export type ClassDeclaration = Type;

export type ModuleClass = ClassDeclaration;
export type ModuleInstance = InstanceType<ModuleClass>;

export type ProviderClass = ClassDeclaration;
export type ProviderInstance = InstanceType<ProviderClass>;

export type InterceptorClass = ClassDeclaration;
export type InterceptorInstance = InstanceType<InterceptorClass>;

export type TransformerClass = ClassDeclaration;
export type TransformerInstance = InstanceType<TransformerClass>;

export type ControllerClass = ClassDeclaration;
export type ControllerInstance = InstanceType<ControllerClass>;

export type GuardClass = ClassDeclaration;
export type GuardInstance = InstanceType<GuardClass>;

export type MicroserviceClass = ClassDeclaration;
export type MicroserviceInstance = InstanceType<TransformerClass>;

export type MiddlewareClass = ClassDeclaration;
export type MiddlewareInstance = InstanceType<GuardClass>;

export type WebSocketClass = ClassDeclaration;
export type WebSocketInstance = InstanceType<WebSocketClass>;

export type WebSocketAdapterClass = ClassDeclaration;
