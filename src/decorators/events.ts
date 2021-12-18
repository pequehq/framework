import 'reflect-metadata';

import { NativeEventsType } from '../models/interfaces/types';
import { EventManager } from '../services/events/event-manager.service';

export interface OnEventInterface {
  event: string | NativeEventsType;
  listener: (...args: unknown[]) => void;
}

export const OnEvent = (event: string | NativeEventsType): MethodDecorator => {
  return <T>(target, propertyKey, descriptor): TypedPropertyDescriptor<T> => {
    EventManager.register({ event, listener: descriptor.value });
    return descriptor;
  };
};
