import express from 'express';
import { HTTP_STATES } from '../models/constants/http-states';

export const guardExecutor = (guard: any) => {
  return async (req: express.Request, res: express.Response, next) => {
    const canExecute = await guard.canExecute({ req, res });
    if (canExecute) {
      next();
    } else {
      res.status(HTTP_STATES.HTTP_403);
      res.send({
        message: 'Forbidden resource',
      });
    }
  };
};
