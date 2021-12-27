import 'reflect-metadata';

import EventEmitter from 'events';
import { Subscription } from 'rxjs';

import { Injectable, OnEventInterface } from '../../decorators';
import { NativeEventsType } from '../../models';
import { DECORATORS } from '../../models/constants/decorators';
import { OnProviderDestroy, OnProviderInit } from '../../models/interfaces/life-cycle.interface';
import { SubjectEvent } from '../../models/interfaces/subject.interface';
import { Subjects } from '../subjects/subjects';

export interface EventPayload<TData> {
  event: string | NativeEventsType;
  timestamp: number;
  data: TData;
}

@Injectable()
export class EventManagerService implements OnProviderInit, OnProviderDestroy {
  private emitter = new EventEmitter();
  private listeners: OnEventInterface[] = [];
  private subscriptions: Subscription[] = [];

  onProviderInit(): void {
    this.listeners = Reflect.getMetadata(DECORATORS.metadata.events.ON_EVENT, EventManagerService) ?? [];

    this.registerListeners();

    for (const key of Object.keys(Subjects)) {
      this.subscriptions.push(
        Subjects[key].subscribe((event: SubjectEvent<unknown>) => {
          if (event) {
            this.push(event.event, event.data);
          }
        }),
      );
    }
  }

  onProviderDestroy(): void {
    this.unregisterListeners();

    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  registerListeners(): void {
    for (const { event, listener } of this.listeners) {
      this.emitter.addListener(event, listener);
    }
  }

  unregisterListeners(): void {
    for (const { event, listener } of this.listeners) {
      this.emitter.removeListener(event, listener);
    }
  }

  push<TData>(event: string | NativeEventsType, data: TData): void {
    const payload: EventPayload<TData> = { event, timestamp: Date.now(), data };
    this.emitter.emit(event, payload);
  }

  subscribe<TData>(event: string | NativeEventsType, listener: (data: EventPayload<TData>) => void): void {
    this.emitter.on(event, listener);
  }
}
