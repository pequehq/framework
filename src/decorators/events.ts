import 'reflect-metadata';

import { DECORATORS } from '../models/constants/decorators';
import { NativeEventsType } from '../models/interfaces/types';
import { EventManagerService } from '../services/events/event-manager.service';

export interface OnEventInterface {
  event: string | NativeEventsType;
  listener: (...args: unknown[]) => void;
}

export const OnEvent = (event: string | NativeEventsType): MethodDecorator => {
  return <T>(target, propertyKey, descriptor): TypedPropertyDescriptor<T> => {
    const eventMap: Map<string, OnEventInterface> =
      Reflect.getMetadata(DECORATORS.metadata.events.ON_EVENT, EventManagerService) ??
      new Map<string, OnEventInterface>();

    eventMap.set(`${target.constructor.name}_${propertyKey}`, { event, listener: descriptor.value });
    Reflect.defineMetadata(DECORATORS.metadata.events.ON_EVENT, eventMap, EventManagerService);
    return descriptor;
  };
};
