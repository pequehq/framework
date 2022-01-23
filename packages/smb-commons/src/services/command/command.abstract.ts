import { Inject } from 'peque-di';

import { EventService } from '../events/event.service';

export abstract class ACommandService<TCommand> {
  @Inject({ identifier: 'EventService' })
  events: EventService;

  abstract init();

  protected sendCommand(command: TCommand): void {
    this.events.next('outgoingCommand', command);
  }
}
