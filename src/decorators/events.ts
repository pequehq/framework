import { TransportType } from '../models';
import { DECORATORS } from '../models/constants/decorators';
import { EventStorage } from '../services/events/event-storage.service';
import { Subjects } from '../services/subjects/subjects';
import { buildEventObject } from '../utils/events.utils';

export const ConsumeEvent = (event: string, transport?: TransportType): MethodDecorator => {
  return <T>(target, propertyKey, descriptor): TypedPropertyDescriptor<T> => {
    if (transport === 'internal') {
      EventStorage.add(buildEventObject({ event, transport, target }), descriptor.value);
    } else {
      // Due to the execution order of the decorators.
      // This will register a callback to be called at convenience by @Microservice() decorator.
      const callbacks = Reflect.getMetadata(DECORATORS.metadata.events.METHODS_CB, target.constructor) || [];
      callbacks.push((transport: TransportType) =>
        EventStorage.add(buildEventObject({ event, transport, target }), descriptor.value),
      );
      Reflect.defineMetadata(DECORATORS.metadata.events.METHODS_CB, callbacks, target.constructor);
    }
    return descriptor;
  };
};

export const ProduceEvent = (event: string, transport?: TransportType): MethodDecorator => {
  return <TValue>(target, propertyKey, descriptor): TypedPropertyDescriptor<TValue> => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]): Promise<TValue> {
      const result = await Promise.resolve(originalMethod.apply(this, args));
      let eventObj = buildEventObject({ event, target });
      if (transport === 'internal') {
        eventObj = buildEventObject({ event, transport, target });
      }

      Subjects.pushEventSubject.next({ event: eventObj, data: result });
      return result;
    };

    return descriptor;
  };
};
