import { ClassDeclaration, InterceptorType } from '../models';
import { interceptorBuilder } from './utils/decorators';

export const Intercept = (interceptorType: InterceptorType, clazz: ClassDeclaration): ClassDecorator => {
  return interceptorBuilder({ type: 'interceptor', interceptorType, clazz });
}
