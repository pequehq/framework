import { MiddlewareHandler } from '../models';
import { methodBuilder } from './utils/decorators';

export const Get = (path: string, middleware: MiddlewareHandler = [], documentOnly = false): MethodDecorator => {
  return methodBuilder('get', path, middleware, documentOnly);
};

export const Post = (path: string, middleware: MiddlewareHandler = [], documentOnly = false): MethodDecorator => {
  return methodBuilder('post', path, middleware, documentOnly);
};

export const Put = (path: string, middleware: MiddlewareHandler = [], documentOnly = false): MethodDecorator => {
  return methodBuilder('put', path, middleware, documentOnly);
};

export const Patch = (path: string, middleware: MiddlewareHandler = [], documentOnly = false): MethodDecorator => {
  return methodBuilder('patch', path, middleware, documentOnly);
};

export const Delete = (path: string, middleware: MiddlewareHandler = [], documentOnly = false): MethodDecorator => {
  return methodBuilder('delete', path, middleware, documentOnly);
};
