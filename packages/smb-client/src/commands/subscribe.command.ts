import { Injectable } from '@peque/di';
import { EventService, ICommandService, ISubscribeCommand } from '@peque/smb-commons';

@Injectable()
export class SubscribeCommand implements ICommandService {
  constructor(private events: EventService) {}

  init(): void {
    this.events.on('subscribe', async (command: ISubscribeCommand) => {
      this.events.next('outgoingCommand', command);
    });
  }
}
