import { Request, Response } from 'express';
import { RouteDefinition } from '../../models';

export const buildParameters = (
  req: Request,
  res: Response,
  route: RouteDefinition
) => {
  const args: any[] = [];
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
    method.params.forEach(
      param => (args[param.index] = req.params[param.param])
    );
  }

  if (method.query && method.query.length > 0) {
    method.query.forEach(param => (args[param.index] = req.query[param.param]));
  }

  if (method.headers && method.headers.length > 0) {
    method.headers.forEach(
      param => (args[param.index] = req.headers[param.param])
    );
  }

  return args;
};

export const swaggerReplaceQueryParamsWithCurlyBrackets = (path: string) => {
  const finalArray = [];
  path.split('/').forEach(parameter => {
    if (parameter.startsWith(':')) {
      finalArray.push(`{${parameter.replace(':', '')}}`);
    } else {
      finalArray.push(parameter);
    }
  });

  const result = finalArray.join('/');
  return result[result.length - 1] === '/'
    ? result.slice(0, Math.max(0, result.length - 1))
    : result;
};
