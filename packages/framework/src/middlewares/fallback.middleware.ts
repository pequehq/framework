import { RequestHandler } from 'express';

import { HTTP_STATES } from '../models/constants/http-states';

export const fallback: RequestHandler = (req, res) => {
  res.status(HTTP_STATES.HTTP_404);
  res.send({
    message: 'Route not found.',
  });
};
