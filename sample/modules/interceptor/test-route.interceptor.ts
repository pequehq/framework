import { HttpException, Interceptor } from '../../../src';
import { Context } from '../../../src/models/interfaces/context.interface';
import {
  HandlerAfterOptions,
  HandlerBeforeOptions,
} from '../../../src/models/interfaces/interceptor/handler-options.interface';
import { InterceptorHandler } from '../../../src/models/interfaces/interceptor/interceptor.interface';

@Interceptor()
export class TestRouteInterceptor implements InterceptorHandler {
  after<TResult>(
    context: Context,
    handlerResult: TResult,
  ): HandlerAfterOptions<TResult> | Promise<HandlerAfterOptions<TResult>> | void | Promise<void> {
    console.log('TestRouteInterceptor after', context.response.locals.interceptorTest);
  }

  before(context: Context): HandlerBeforeOptions | Promise<HandlerBeforeOptions> {
    console.log('TestRouteInterceptor before');
    return { override: false };
  }

  error<TError>(context: Context, error: HttpException<TError>) {
    console.log('TestRouteInterceptor error');
  }
}
