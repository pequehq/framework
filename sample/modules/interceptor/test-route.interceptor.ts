import { InterceptorHandler } from '../../../src/models/interfaces/interceptor.interface';
import { Interceptor } from '../../../src';
import { Context } from '../../../src/models/interfaces/context.interface';

@Interceptor()
export class TestRouteInterceptor implements InterceptorHandler {
  after(context: Context) {
    console.log('TestRouteInterceptor after', context.response.locals.interceptorTest);
  }

  before(context: Context) {
    console.log('TestRouteInterceptor before');
  }

  error(context: Context) {
    console.log('TestRouteInterceptor error');
  }
}
