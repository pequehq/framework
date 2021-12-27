import { HttpException, Interceptor } from '../../../src';
import { Context } from '../../../src/models/interfaces/context.interface';
import {
  HandlerAfterOptions,
  HandlerBeforeOptions,
} from '../../../src/models/interfaces/interceptor/handler-options.interface';
import { InterceptorHandler } from '../../../src/models/interfaces/interceptor/interceptor.interface';

@Interceptor()
export class TestControllerInterceptor implements InterceptorHandler {
  after<TResult>(
    context: Context,
    handlerResult: TResult,
  ): HandlerAfterOptions<TResult> | Promise<HandlerAfterOptions<TResult>> | void | Promise<void> {
    console.log('TestControllerInterceptor after', context.response.locals.interceptorTest);
  }

  before(context: Context): HandlerBeforeOptions | Promise<HandlerBeforeOptions> | void | Promise<void> {
    console.log('TestControllerInterceptor before');
    context.response.locals.interceptorTest = { test: 'hello' };
  }

  error<TError>(context: Context, error: HttpException<TError>) {
    console.log('TestControllerInterceptor error');
  }
}
