import { HttpException } from '../../errors/errors';
import { Context } from '../context.interface';
import { HandlerAfterOptions, HandlerBeforeOptions } from './handler-options.interface';

export interface InterceptorHandler {
  before(context: Context): HandlerBeforeOptions | Promise<HandlerBeforeOptions> | void | Promise<void>;
  after(
    context: Context,
    handlerResult: unknown,
  ): HandlerAfterOptions<unknown> | Promise<HandlerAfterOptions<unknown>> | void | Promise<void>;
  error(context: Context, error: HttpException<unknown>): void;
}
