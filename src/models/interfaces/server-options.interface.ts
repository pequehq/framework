import type { Application, RequestHandler } from 'express';
import { SessionOptions } from 'express-session';

import { LoggerInterface } from './logger.interface';
import { SwaggerOptionsInterface } from './swagger/swagger-options.interface';
import { GuardClass, ModuleClass } from './types';

interface GlobalMiddlewares {
  preRoutes?: RequestHandler[];
  postRoutes?: RequestHandler[];
}

export interface ServerOptions {
  rootModule: ModuleClass;
  port?: number;
  hostname?: string;
  existingApp?: Application;
  globalMiddlewares?: GlobalMiddlewares;
  isCpuClustered?: boolean;
  timeout?: number; // @TODO check why unused
  keepAliveTimeout?: number; // @TODO check why unused
  headersTimeout?: number; // @TODO check why unused
  swagger?: SwaggerOptionsInterface;
  logger?: LoggerInterface;
  guards?: GuardClass[];
  session?: SessionOptions;
  showOriginalErrorObject?: boolean;
}
