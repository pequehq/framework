import {
  Context,
  HandlerAfterOptions,
  HandlerBeforeOptions,
  HttpException,
  Interceptor,
  InterceptorHandler,
} from '../../../dist';

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
