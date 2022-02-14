import type { CorsOptions } from 'cors';
import type { Application, RequestHandler } from 'express';
import type { SessionOptions } from 'express-session';

import { IGraphQLOptions } from './graphql-options.interface';
import type { LoggerInterface } from './logger.interface';
import type { SwaggerOptionsInterface } from './swagger/swagger-options.interface';
import type { GuardClass, ModuleClass } from './types';

interface GlobalMiddlewares {
  preRoutes?: RequestHandler[];
  postRoutes?: RequestHandler[];
}

export interface WebServerOptions {
  rootModule: ModuleClass;
  port?: number;
  hostname?: string;
  existingApp?: Application;
  globalMiddlewares?: GlobalMiddlewares;
  isCpuClustered?: boolean;
  timeout?: number; // @TODO check why unused
  keepAliveTimeout?: number; // @TODO check why unused
  headersTimeout?: number; // @TODO check why unused
  graphQL?: IGraphQLOptions;
  swagger?: SwaggerOptionsInterface;
  logger?: LoggerInterface;
  guards?: GuardClass[];
  session?: SessionOptions;
  showOriginalErrorObject?: boolean;
  cors?: boolean | CorsOptions;
}
