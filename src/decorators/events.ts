import 'reflect-metadata';

import { NativeEventsType } from '../models';
import { DECORATORS } from '../models/constants/decorators';
import { EventManagerService } from '../services/events/event-manager.service';

export interface OnEventInterface {
  event: string | NativeEventsType;
  listener: (...args: unknown[]) => void;
}

export const OnEvent = (event: string | NativeEventsType): MethodDecorator => {
  return <T>(target, propertyKey, descriptor): TypedPropertyDescriptor<T> => {
    const events: OnEventInterface[] =
      Reflect.getMetadata(DECORATORS.metadata.events.ON_EVENT, EventManagerService) || [];
    events.push({ event, listener: descriptor.value });
    Reflect.defineMetadata(DECORATORS.metadata.events.ON_EVENT, events, EventManagerService);
    return descriptor;
  };
};
