import 'reflect-metadata';

import EventEmitter from 'events';

import { OnEventInterface } from '../../decorators/events';
import { NATIVE_SERVICES } from '../../models/constants/native-services';
import { Injector } from '../../models/dependency-injection/injector.service';
import { NativeEventsType } from '../../models/interfaces/types';

export interface EventPayload<TData> {
  event: string | NativeEventsType;
  timestamp: number;
  data: TData;
}

export class EventManagerService {
  private emitter = new EventEmitter();

  register(value: OnEventInterface) {
    this.emitter.addListener(value.event, value.listener)
  }

  push<TData>(event: string | NativeEventsType, data: TData): void {
    const payload: EventPayload<TData> = { event, timestamp: Date.now(), data };
    this.emitter.emit(event, payload);
  }

  subscribe<TData>(event: string | NativeEventsType, listener: (data: EventPayload<TData>) => void): void {
    this.emitter.on(event, listener);
  }

  ciao() {
    console.log('ciso');
  }
}

Injector.setNative(NATIVE_SERVICES.EVENT_MANAGER, EventManagerService);

export const EventManager = Injector.resolve<EventManagerService>(NATIVE_SERVICES.EVENT_MANAGER);
