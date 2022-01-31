import { Injectable } from '@peque/di';
import { EventService, ICommandService, IUnsubscribeCommand } from '@peque/smb-commons';

@Injectable()
export class UnsubscribeCommand implements ICommandService {
  constructor(private events: EventService) {}

  init(): void {
    this.events.on('unsubscribe', async (command: IUnsubscribeCommand) => {
      this.events.next('outgoingCommand', command);
    });
  }
}
