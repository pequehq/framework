import express, { ErrorRequestHandler, RequestHandler } from 'express';

import { InterceptorInstance, InterceptorStage } from '../models';
import { HandlerAfterOptions } from '../models';

export const interceptorHandler = (interceptor: InterceptorInstance, stage: InterceptorStage): RequestHandler => {
  return async (req: express.Request, res: express.Response, next): Promise<void> => {
    try {
      if (stage === 'before') {
        res.locals.handlerOptions = await Promise.resolve(interceptor[stage]({ request: req, response: res }));
      }

      if (stage === 'after') {
        const handlerResult: HandlerAfterOptions<unknown> = await Promise.resolve(
          interceptor[stage]({ request: req, response: res }, res.locals.data),
        );

        if (handlerResult) {
          res.locals.data = handlerResult.handlerResult;
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const interceptorErrorHandler = (interceptor: InterceptorInstance): ErrorRequestHandler => {
  return async (err, req: express.Request, res: express.Response, next): Promise<void> => {
    try {
      res.locals.handlerOptions = await Promise.resolve(interceptor.error({ request: req, response: res }, err));
      next(err);
    } catch (error) {
      next(error);
    }
  };
};
