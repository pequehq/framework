import { Handler } from 'express';

import { MiddlewareClass, MiddlewareHandler, MiddlewareInstance } from '../../models';
import { Injector } from '../../models/dependency-injection/dependency-injection.service';

class MiddlewareService {
  returnHandlers(middlewares: MiddlewareClass[]): Handler[] {
    return middlewares.map<MiddlewareInstance>(
      (middleware) => Injector.resolve<MiddlewareHandler>('middleware', middleware.name).handler,
    );
  }
}

export const Middlewares = new MiddlewareService();
