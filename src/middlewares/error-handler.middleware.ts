import { ErrorRequestHandler } from 'express';

import { HTTP_STATES } from '../models/constants/http-states';
import { HttpException } from '../models';

export const errorHandler: ErrorRequestHandler = (err: HttpException<unknown>, req, res, next) => {
  const statusCode = err.httpException ? err.httpException.statusCode : HTTP_STATES.HTTP_500;
  const error = err.httpException ? err.httpException : {
    statusCode: HTTP_STATES.HTTP_500,
    err,
    message: 'Unknown error.'
  };

  res.setHeader('Content-Type', 'application/json');
  res.status(statusCode).send({ ...error });
  res.end();
};
