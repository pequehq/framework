import 'reflect-metadata';
import { EventManagerService } from '../services/events/event-manager.service';
import { NativeEventsType } from '../models/interfaces/types';
import { DECORATORS } from '../models/constants/decorators';

export interface OnEventInterface {
  event: string | NativeEventsType;
  listener: any;
}

export const OnEvent = (event: string | NativeEventsType) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const eventMap: Map<string, OnEventInterface> = Reflect.getMetadata(DECORATORS.metadata.events.ON_EVENT, EventManagerService) || new Map<string, OnEventInterface>();
    eventMap.set(`${target.constructor.name}_${propertyKey}`, { event, listener: descriptor.value });
    Reflect.defineMetadata(DECORATORS.metadata.events.ON_EVENT, eventMap, EventManagerService);
    return descriptor;
  };
}
