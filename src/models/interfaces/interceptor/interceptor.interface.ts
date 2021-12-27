import { HttpException } from '../../errors/errors';
import { Context } from '../context.interface';
import { HandlerAfterOptions, HandlerBeforeOptions } from './handler-options.interface';

export interface InterceptorHandler {
  before(context: Context): HandlerBeforeOptions | Promise<HandlerBeforeOptions> | void | Promise<void>;
  after<TResult>(
    context: Context,
    handlerResult: TResult,
  ): HandlerAfterOptions<TResult> | Promise<HandlerAfterOptions<TResult>> | void | Promise<void>;
  error<TError>(context: Context, error: HttpException<TError>);
}
