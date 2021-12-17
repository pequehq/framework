import { Request, Response } from 'express';

import { HttpEvent } from '../models/_index';
import { httpEventQueue } from '../services/http-event/http-event.service';

export const pushHttpEvents = (req: Request, res: Response, next: any): void => {
  const event: HttpEvent = { req };
  httpEventQueue.next(event);
  next();
};
