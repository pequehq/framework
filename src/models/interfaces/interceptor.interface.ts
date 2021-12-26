import { Context } from './context.interface';

export interface InterceptorHandler {
  before(context: Context);
  after(context: Context);
  error(context: Context);
}
