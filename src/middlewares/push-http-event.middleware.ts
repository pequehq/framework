import { Request, Response } from 'express';
import { httpEventQueue } from '../services/http-event/http-event.service';
import { HttpEvent } from '../models/interfaces/http-event.interface';

export const pushHttpEvents = (req: Request, res: Response, next: any) => {
  const event: HttpEvent = { req };
  httpEventQueue.next(event);
  next();
}
