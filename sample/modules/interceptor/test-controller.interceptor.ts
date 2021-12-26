import { InterceptorHandler } from '../../../src/models/interfaces/interceptor.interface';
import { Interceptor } from '../../../src';
import { Context } from '../../../src/models/interfaces/context.interface';

@Interceptor()
export class TestControllerInterceptor implements InterceptorHandler {
  after(context: Context) {
    console.log('TestControllerInterceptor after', context.response.locals.interceptorTest);
  }

  before(context: Context) {
    console.log('TestControllerInterceptor before');
    context.response.locals.interceptorTest = { test: 'hello' };
  }

  error(context: Context) {
    console.log('TestControllerInterceptor error');
  }
}
