import { SessionOptions } from 'express-session';

import { GlobalMiddlewares } from '../../server';
import { LoggerInterface } from './logger.interface';
import { SwaggerOptionsInterface } from './swagger/swagger-options.interface';

export interface ServerOptions {
  rootModule: any;
  port?: number;
  hostname?: string;
  existingApp?: any;
  globalMiddlewares?: GlobalMiddlewares;
  isCpuClustered?: boolean;
  timeout?: number;
  keepAliveTimeout?: number;
  headersTimeout?: number;
  swagger?: SwaggerOptionsInterface;
  logger?: LoggerInterface;
  guards?: any[];
  session?: SessionOptions;
}
