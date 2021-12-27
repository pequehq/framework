import { RequestHandler } from 'express';

export const responder: RequestHandler = (req, res, next): void => {
  const data = res.locals.data;
  res.setHeader('Content-Type', 'application/json');
  res.status((data as object)['statusCode'] ?? 200);
  res.send(data);
  res.end();
};
