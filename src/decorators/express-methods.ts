import { RequestHandler } from 'express';
import { MiddlewareHandler } from '../models/_index';
import { methodBuilder } from './utils/decorators';

export const Get = (
  path: string,
  middleware: MiddlewareHandler = [],
  documentOnly = false,
  noRestWrapper = false
): MethodDecorator => {
  return methodBuilder('get', path, middleware, documentOnly, noRestWrapper);
};

export const Post = (
  path: string,
  middleware: MiddlewareHandler = [],
  documentOnly = false,
  noRestWrapper = false
): MethodDecorator => {
  return methodBuilder('post', path, middleware, documentOnly, noRestWrapper);
};

export const Put = (
  path: string,
  middleware: MiddlewareHandler = [],
  documentOnly = false,
  noRestWrapper = false
): MethodDecorator => {
  return methodBuilder('put', path, middleware, documentOnly, noRestWrapper);
};

export const Patch = (
  path: string,
  middleware: MiddlewareHandler = [],
  documentOnly = false,
  noRestWrapper = false
): MethodDecorator => {
  return methodBuilder('patch', path, middleware, documentOnly, noRestWrapper);
};

export const Delete = (
  path: string,
  middleware: RequestHandler | RequestHandler[] = [],
  documentOnly = false,
  noRestWrapper = false
): MethodDecorator => {
  return methodBuilder('delete', path, middleware, documentOnly, noRestWrapper);
};
