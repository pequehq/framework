import { Event, Listener, OnEventInterface, TransportType } from '../../models';
import { buildEventName } from '../../utils/events.utils';

class EventStorageService {
  #listeners = new Map<string, Listener[]>();

  add(event: Event, listener: Listener): void {
    const eventListeners = this.#listeners.get(buildEventName(event)) ?? [];
    eventListeners.push(listener);
    this.#listeners.set(buildEventName(event), eventListeners);
  }

  remove(event: Event): void {
    this.#listeners.delete(buildEventName(event));
  }

  get(event: Event): OnEventInterface[] {
    const events: OnEventInterface[] = [];
    const listeners = this.#listeners.get(buildEventName(event)) || [];
    for (const listener of listeners) {
      events.push({ event, listener });
    }
    return events;
  }

  getAll(): OnEventInterface[] {
    const events: OnEventInterface[] = [];
    for (const [event, listeners] of this.#listeners) {
      const eventSplit = event.split('.');
      for (const listener of listeners) {
        events.push({ event: { event: eventSplit[1], transport: eventSplit[0] as TransportType }, listener });
      }
    }
    return events;
  }

  removeAll(): void {
    this.#listeners.clear();
  }
}

export const EventStorage = new EventStorageService();
