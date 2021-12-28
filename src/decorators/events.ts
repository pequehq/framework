import 'reflect-metadata';

import { NativeEventsType } from '../models';
import { EventStorage } from '../services/events/event-storage.service';

export const OnEvent = (event: string | NativeEventsType): MethodDecorator => {
  return <T>(target, propertyKey, descriptor): TypedPropertyDescriptor<T> => {
    EventStorage.add(event, descriptor.value);
    return descriptor;
  };
};
