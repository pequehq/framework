import { TransformerClass } from '../models';
import { paramBuilder } from './utils/decorators';

export const Request = (): ParameterDecorator => {
  return paramBuilder('request');
};

export const Response = (): ParameterDecorator => {
  return paramBuilder('response');
};

export const Body = (transformer?: TransformerClass): ParameterDecorator => {
  return paramBuilder('body', { transformer });
};

export const Param = (param: string, transformer?: TransformerClass): ParameterDecorator => {
  return paramBuilder('param', { paramName: param, transformer });
};

export const Query = (param: string, transformer?: TransformerClass): ParameterDecorator => {
  return paramBuilder('query', { paramName: param, transformer });
};

export const Header = (header: string, transformer?: TransformerClass): ParameterDecorator => {
  return paramBuilder('header', { paramName: header, transformer });
};

export const Cookie = (cookie: string): ParameterDecorator => {
  return paramBuilder('cookies', { paramName: cookie });
};

export const Session = (): ParameterDecorator => {
  return paramBuilder('session');
};
