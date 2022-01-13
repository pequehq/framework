import { NextFunction, Request, Response } from 'express';

export interface MiddlewareHandler {
  handler(req: Request, res: Response, next: NextFunction): void;
}
