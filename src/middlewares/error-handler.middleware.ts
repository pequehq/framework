import { ErrorRequestHandler } from 'express';

import { HTTP_STATES } from '../models/constants/http-states';

export const logError: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  next(err);
};

export const errorHandler: ErrorRequestHandler = (err, req, res) => {
  res.status(HTTP_STATES.HTTP_500);
  res.send({ error: err });
};
