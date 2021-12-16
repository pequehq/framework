import { Request, Response } from 'express';

import { RouteDefinition } from '../../models/_index';

export const buildParameters = (req: Request, res: Response, route: RouteDefinition): unknown[] => {
  const args: unknown[] = [];
  const method = route.method;

  if (method.request && method.request.length > 0) {
    args[method.request[0].index] = req;
  }

  if (method.response && method.response.length > 0) {
    args[method.response[0].index] = res;
  }

  if (method.body && method.body.length > 0) {
    args[method.body[0].index] = req.body;
  }

  if (method.params && method.params.length > 0) {
    method.params.forEach((param) => (args[param.index] = req.params[param.param]));
  }

  if (method.query && method.query.length > 0) {
    method.query.forEach((param) => (args[param.index] = req.query[param.param]));
  }

  if (method.headers && method.headers.length > 0) {
    method.headers.forEach((param) => (args[param.index] = req.headers[param.param]));
  }

  if (method.cookies && method.cookies.length > 0) {
    method.cookies.forEach((param) => (args[param.index] = req.cookies[param.param]));
  }

  if (method.session && method.session.length > 0) {
    method.session.forEach((param) => (args[param.index] = req['session']));
  }

  return args;
};

export const swaggerReplaceQueryParamsWithCurlyBrackets = (path: string): string => {
  const finalArray = [];
  path.split('/').forEach((parameter) => {
    if (parameter.startsWith(':')) {
      finalArray.push(`{${parameter.replace(':', '')}}`);
    } else {
      finalArray.push(parameter);
    }
  });

  const result = finalArray.join('/');
  return result[result.length - 1] === '/' ? result.slice(0, Math.max(0, result.length - 1)) : result;
};
