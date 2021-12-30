import { Request, RequestHandler, Response } from 'express';

import { HttpEvent } from '../models';
import { httpEventQueue } from '../services/http-event/http-event.service';

export const pushHttpEvents: RequestHandler = (req: Request, res: Response, next): void => {
  const event: HttpEvent = { req };
  httpEventQueue.next(event);
  next();
};
