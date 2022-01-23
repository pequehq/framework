import EventEmitter from 'events';
import { Injectable } from 'peque-di';

import { ISubjectTypes, Listener } from '../../models';

@Injectable()
export class EventService {
  #emitter = new EventEmitter();

  next(event: ISubjectTypes, data: unknown): void {
    this.#emitter.emit(event, data);
  }

  on(event: ISubjectTypes, listener: Listener): void {
    this.#emitter.addListener(event, listener);
  }
}
