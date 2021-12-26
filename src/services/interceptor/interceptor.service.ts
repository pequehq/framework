import { Subjects } from '../subjects/subjects';
import { SubjectEvent } from '../../models/interfaces/subject.interface';
import { Injector } from '../../models/dependency-injection/injector.service';
import { NATIVE_SERVICES } from '../../models/constants/native-services';
import { DECORATORS } from '../../models/constants/decorators';
import { Injectable } from '../../decorators';

export class InterceptorService {
  constructor() {
    console.log(Reflect.getMetadata(DECORATORS.metadata.interceptor.INTERCEPTORS, InterceptorService));
    //Subjects.interceptorSubject.subscribe((event: SubjectEvent<unknown>) => {
    //  console.log(event);
    //})
  }
}

Injector.setNative('injectable', NATIVE_SERVICES.INTERCEPTOR, InterceptorService);
const Interceptor = Injector.resolve<InterceptorService>('injectable', NATIVE_SERVICES.INTERCEPTOR);
