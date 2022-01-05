import { NextFunction, Request, Response } from 'express';

import { Middleware, MiddlewareHandler } from '../../../dist';

@Middleware()
export class TestMwMiddleware implements MiddlewareHandler {
  handler(req: Request, res: Response, next: NextFunction): void {
    console.log('Test Middleware has been executed.');
    next();
  }
}
