import { Listener, NativeEventsType } from '../../models';

export interface OnEventInterface {
  event: string | NativeEventsType;
  listener: (...args: unknown[]) => unknown;
}

class EventStorageService {
  private listeners = new Map<string, Listener[]>();

  add(event: string, listener: Listener): void {
    const eventListeners = this.listeners.get(event) ?? [];
    eventListeners.push(listener);
    this.listeners.set(event, eventListeners);
  }

  remove(event: string): void {
    this.listeners.delete(event);
  }

  get(event: string): OnEventInterface[] {
    const events: OnEventInterface[] = [];
    const listeners = this.listeners.get(event) ?? [];
    listeners.forEach((listener) => events.push({ event, listener }));
    return events;
  }

  getAll(): OnEventInterface[] {
    const events: OnEventInterface[] = [];
    this.listeners.forEach((listeners, event) => {
      listeners.forEach((listener) => events.push({ event, listener }));
    });
    return events;
  }
}

export const EventStorage = new EventStorageService();
