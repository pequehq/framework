import { Injectable } from 'peque-di';

import { EventService } from '../events/event.service';

@Injectable()
export class CommandError {
  constructor(private events: EventService) {}

  // @TODO implement a logger service.
  init(): void {
    this.events.on('error', (error) => console.error(error));
  }
}
