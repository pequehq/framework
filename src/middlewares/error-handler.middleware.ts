import { Request, Response } from 'express';
import { HTTP_STATES } from '../models/constants/http-states';

export const logError = (err: Error, req: Request, res: Response, next: any) => {
  console.error(err);
  next(err);
}

export const errorHandler = (err: Error, req: Request, res: Response, next: any) => {
  res.status(HTTP_STATES.HTTP_500);
  res.send({ error: err });
}
