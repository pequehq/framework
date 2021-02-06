import { Request, Response } from 'express';
import { HTTP_STATES } from '../models/constants/http-states';

export const fallback = (req: Request, res: Response, next: any) => {
  res.status(HTTP_STATES.HTTP_404);
  res.send({
    message: 'Route not found.'
  })
}
