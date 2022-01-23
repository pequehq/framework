import { Inject } from 'peque-di';

import { EventService } from '../events/event.service';

export abstract class ACommandService {
  @Inject({ identifier: 'EventService' })
  events: EventService;

  abstract init();
}
