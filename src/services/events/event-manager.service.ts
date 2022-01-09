import 'reflect-metadata';

import EventEmitter from 'events';
import { Subscription } from 'rxjs';

import { Injectable } from '../../decorators';
import { EventPayload, NativeEventsType } from '../../models';
import { OnProviderDestroy, OnProviderInit } from '../../models';
import { SubjectEvent } from '../../models/interfaces/subject.interface';
import { buildEventName } from '../../utils/events.utils';
import { Subjects } from '../subjects/subjects';
import { EventStorage } from './event-storage.service';

@Injectable()
export class EventManagerService implements OnProviderInit, OnProviderDestroy {
  private emitter = new EventEmitter();
  private subscriptions: Subscription[] = [];

  onProviderInit(): void {
    this.registerListeners();

    for (const key of Object.keys(Subjects)) {
      this.subscriptions.push(
        Subjects[key].subscribe((event: SubjectEvent<unknown>) => {
          if (event) {
            this.push(buildEventName(event.event), event.data);
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
    for (const { event, listener } of EventStorage.getAll()) {
      this.emitter.addListener(buildEventName(event), listener);
    }
  }

  unregisterListeners(): void {
    for (const { event, listener } of EventStorage.getAll()) {
      this.emitter.removeListener(event.event, listener);
      EventStorage.remove(event);
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
