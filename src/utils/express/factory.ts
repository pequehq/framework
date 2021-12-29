import { Request, Response } from 'express';

import { RouteDefinition } from '../../models';
import { Transformers } from '../../services/transformer/transformer.service';

export const buildParameters = async (req: Request, res: Response, route: RouteDefinition): Promise<unknown[]> => {
  const args: unknown[] = [];
  const method = route.method;

  if (method.request?.length) {
    args[method.request[0].index] = req;
  }

  if (method.response?.length) {
    args[method.response[0].index] = res;
  }

  if (method.body?.length) {
    args[method.body[0].index] = await Transformers.transform(req.body, method.body[0].transformer as never);
  }

  if (method.params?.length) {
    for (const param of method.params) {
      args[param.index] = await Transformers.transform(req.params[param.param], param.transformer as never);
    }
  }

  if (method.query?.length) {
    for (const param of method.query) {
      args[param.index] = await Transformers.transform(req.query[param.param], param.transformer as never);
    }
  }

  if (method.headers?.length) {
    for (const param of method.headers) {
      args[param.index] = await Transformers.transform(req.headers[param.param], param.transformer as never);
    }
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
