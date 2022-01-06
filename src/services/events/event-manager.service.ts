import 'reflect-metadata';

import EventEmitter from 'events';
import { Subscription } from 'rxjs';

import { Injectable } from '../../decorators';
import { NativeEventsType } from '../../models';
import { OnProviderDestroy, OnProviderInit } from '../../models';
import { SubjectEvent } from '../../models/interfaces/subject.interface';
import { Subjects } from '../subjects/subjects';
import { EventStorage } from './event-storage.service';

export interface EventPayload<TData> {
  event: string | NativeEventsType;
  timestamp: number;
  data: TData;
}

@Injectable()
export class EventManagerService implements OnProviderInit, OnProviderDestroy {
  #emitter = new EventEmitter();
  #subscriptions: Subscription[] = [];

  onProviderInit(): void {
    this.#registerListeners();

    for (const key of Object.keys(Subjects)) {
      this.#subscriptions.push(
        Subjects[key].subscribe((event: SubjectEvent<unknown>) => {
          if (event) {
            this.push(event.event, event.data);
          }
        }),
      );
    }
  }

  onProviderDestroy(): void {
    this.#unregisterListeners();

    for (const subscription of this.#subscriptions) {
      subscription.unsubscribe();
    }
  }

  #registerListeners(): void {
    for (const { event, listener } of EventStorage.getAll()) {
      this.#emitter.addListener(event, listener);
    }
  }

  #unregisterListeners(): void {
    for (const { event, listener } of EventStorage.getAll()) {
      this.#emitter.removeListener(event, listener);
      EventStorage.remove(event);
    }
  }

  push<TData>(event: string | NativeEventsType, data: TData): void {
    const payload: EventPayload<TData> = { event, timestamp: Date.now(), data };
    this.#emitter.emit(event, payload);
  }

  subscribe<TData>(event: string | NativeEventsType, listener: (data: EventPayload<TData>) => void): void {
    this.#emitter.on(event, listener);
  }
}
