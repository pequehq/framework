import 'reflect-metadata';
import EventEmitter from 'events';
import { Injectable, OnEventInterface } from '../../decorators';
import { NativeEventsType } from '../../models';
import { DECORATORS } from '../../models/constants/decorators';
import { OnProviderInit } from '../../models/interfaces/life-cycle.interface';
import { Subjects } from '../subjects/subjects';
import { SubjectEvent } from '../../models/interfaces/subject.interface';

export interface EventPayload<TData> {
  event: string | NativeEventsType;
  timestamp: number;
  data: TData;
}

@Injectable()
export class EventManagerService implements OnProviderInit {
  private emitter = new EventEmitter();

  onProviderInit() {
    const listeners: OnEventInterface[] = Reflect.getMetadata(DECORATORS.metadata.events.ON_EVENT, EventManagerService) || [];
    listeners.forEach(listener => this.register(listener));

    for (const key in Object.keys(Subjects)) {
      Subjects[key].subscribe((event: SubjectEvent<unknown>) => {
        if (event) {
          this.push(event.event, event.data);
        }
      })
    }
  }

  register(value: OnEventInterface) {
    this.emitter.addListener(value.event, value.listener);
  }

  push<TData>(event: string | NativeEventsType, data: TData): void {
    const payload: EventPayload<TData> = { event, timestamp: Date.now(), data };
    this.emitter.emit(event, payload);
  }

  subscribe<TData>(event: string | NativeEventsType, listener: (data: EventPayload<TData>) => void): void {
    this.emitter.on(event, listener);
  }
}
