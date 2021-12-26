import express, { ErrorRequestHandler, RequestHandler } from 'express';
import { InterceptorInstance, InterceptorStage } from '../models';
import { Context } from '../models/interfaces/context.interface';

export const interceptorHandler = (interceptor: InterceptorInstance, stage: InterceptorStage): RequestHandler => {
  return async (req: express.Request, res: express.Response, next) => {
    try {
      await interceptor[stage]({ request: req, response: res });
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const interceptorErrorHandler = (interceptor: InterceptorInstance): ErrorRequestHandler => {
  return async (err, req: express.Request, res: express.Response, next) => {
    try {
      await interceptor.error({ request: req, response: res });
      next(err);
    } catch (error) {
      next(error);
    }
  };
};
