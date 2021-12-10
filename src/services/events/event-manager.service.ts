import 'reflect-metadata';
import { Injectable } from '../../decorators/injectable';
import EventEmitter from 'events';
import { NativeEventsType } from '../../models/interfaces/types';
import { OnEventInterface } from '../../decorators/events';
import { DECORATORS } from '../../models/constants/decorators';

export interface EventData {
  event: string | NativeEventsType;
  timestamp: number;
  data: any
}

@Injectable()
export class EventManagerService {
  private emitter = new EventEmitter();

  constructor() {
    const eventMap: Map<string, OnEventInterface> = Reflect.getMetadata(DECORATORS.metadata.events.ON_EVENT, EventManagerService) || new Map<string, OnEventInterface>();
    eventMap.forEach((value, key) => this.emitter.addListener(value.event, value.listener));
  }

  push(event: string | NativeEventsType, data: any) {
    const eventData: EventData = {
      event,
      timestamp: Date.now(),
      data
    }
    this.emitter.emit(event, eventData);
  }

  subscribe(event: string | NativeEventsType, listener: (...args: any[]) => void) {
    this.emitter.on(event, listener);
  }
}
