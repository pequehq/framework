import { GlobalMiddlewares } from '../../server';

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
}
