import { NativeEventsType } from '../models';
import { EventStorage } from '../services/events/event-storage.service';
import { Subjects } from '../services/subjects/subjects';

export const ConsumeEvent = (event: string | NativeEventsType): MethodDecorator => {
  return <T>(target, propertyKey, descriptor): TypedPropertyDescriptor<T> => {
    EventStorage.add(event, descriptor.value);
    return descriptor;
  };
};

export const ProduceEvent = (event: string): MethodDecorator => {
  return <TValue>(target, propertyKey, descriptor): TypedPropertyDescriptor<TValue> => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]): Promise<TValue> {
      const result = await Promise.resolve(originalMethod.apply(this, args));
      Subjects.pushEventSubject.next({ event, data: result });
      return result;
    };

    return descriptor;
  };
};
