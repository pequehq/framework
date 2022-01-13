import { methodBuilder } from './utils/decorators';

export const Get = (path: string, documentOnly = false): MethodDecorator => {
  return methodBuilder('get', path, documentOnly);
};

export const Post = (path: string, documentOnly = false): MethodDecorator => {
  return methodBuilder('post', path, documentOnly);
};

export const Put = (path: string, documentOnly = false): MethodDecorator => {
  return methodBuilder('put', path, documentOnly);
};

export const Patch = (path: string, documentOnly = false): MethodDecorator => {
  return methodBuilder('patch', path, documentOnly);
};

export const Delete = (path: string, documentOnly = false): MethodDecorator => {
  return methodBuilder('delete', path, documentOnly);
};
