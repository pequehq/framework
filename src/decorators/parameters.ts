import { paramBuilder } from './utils/decorators';

export const Request = (): ParameterDecorator => {
  return paramBuilder('request');
};

export const Response = (): ParameterDecorator => {
  return paramBuilder('response');
};

export const Body = (): ParameterDecorator => {
  return paramBuilder('body');
};

export const Param = (param: string): ParameterDecorator => {
  return paramBuilder('param', param);
};

export const Query = (param: string): ParameterDecorator => {
  return paramBuilder('query', param);
};

export const Header = (header: string): ParameterDecorator => {
  return paramBuilder('header', header);
};

export const Cookie = (cookie: string): ParameterDecorator => {
  return paramBuilder('cookies', cookie);
};

export const Session = (): ParameterDecorator => {
  return paramBuilder('session');
};
