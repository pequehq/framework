import express, { NextFunction } from 'express';

import { HTTP_STATES } from '../models/constants/http-states';

export const guardHandler = (guard: any) => {
  return async (req: express.Request, res: express.Response, next: NextFunction): Promise<void> => {
    try {
      const canExecute = await guard.canExecute({ request: req, response: res });
      if (canExecute) {
        next();
      } else {
        res.status(HTTP_STATES.HTTP_403);
        res.send({
          message: 'Forbidden resource',
        });
      }
    } catch (error) {
      next(error);
    }
  };
};
