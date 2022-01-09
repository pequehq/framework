import { Event, Listener, OnEventInterface, TransportType } from '../../models';
import { buildEventName } from '../../utils/events.utils';

class EventStorageService {
  private listeners = new Map<string, Listener[]>();

  add(event: Event, listener: Listener): void {
    const eventListeners = this.listeners.get(buildEventName(event)) ?? [];
    eventListeners.push(listener);
    this.listeners.set(buildEventName(event), eventListeners);
  }

  remove(event: Event): void {
    this.listeners.delete(buildEventName(event));
  }

  get(event: Event): OnEventInterface[] {
    const events: OnEventInterface[] = [];
    const listeners = this.listeners.get(buildEventName(event)) || [];
    listeners.forEach((listener) => events.push({ event, listener }));
    return events;
  }

  getAll(): OnEventInterface[] {
    const events: OnEventInterface[] = [];
    this.listeners.forEach((listeners, event) => {
      const eventSplit = event.split('.');
      listeners.forEach((listener) =>
        events.push({ event: { event: eventSplit[1], transport: eventSplit[0] as TransportType }, listener }),
      );
    });
    return events;
  }

  removeAll(): void {
    this.listeners.clear();
  }
}

export const EventStorage = new EventStorageService();
