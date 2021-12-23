import { Request, Response } from 'express';

import { RouteDefinition } from '../../models';

export const buildParameters = (req: Request, res: Response, route: RouteDefinition): unknown[] => {
  const args: unknown[] = [];
  const method = route.method;

  if (method.request?.length) {
    args[method.request[0].index] = req;
  }

  if (method.response?.length) {
    args[method.response[0].index] = res;
  }

  if (method.body?.length) {
    args[method.body[0].index] = req.body;
  }

  if (method.params?.length) {
    method.params.forEach((param) => (args[param.index] = req.params[param.param]));
  }

  if (method.query?.length) {
    method.query.forEach((param) => (args[param.index] = req.query[param.param]));
  }

  if (method.headers?.length) {
    method.headers.forEach((param) => (args[param.index] = req.headers[param.param]));
  }

  if (method.cookies?.length) {
    method.cookies.forEach((param) => (args[param.index] = req.cookies[param.param]));
  }

  if (method.session?.length) {
    method.session.forEach((param) => (args[param.index] = req['session']));
  }

  return args;
};

export const swaggerReplaceQueryParamsWithCurlyBrackets = (path: string): string => {
  const finalArray: string[] = [];

  path.split('/').forEach((parameter) => {
    if (parameter.startsWith(':')) {
      finalArray.push(`{${parameter.replace(':', '')}}`);
    } else {
      finalArray.push(parameter);
    }
  });

  const result = finalArray.join('/');
  return result.endsWith('/') ? result.slice(0, Math.max(0, result.length - 1)) : result;
};
