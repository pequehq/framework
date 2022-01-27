import { Injectable } from 'peque-di';
import { EventService, ICommandService, IMessageCommand } from 'peque-smb-commons';

@Injectable()
export class MessageCommand implements ICommandService {
  constructor(private events: EventService) {
    this.init();
  }

  init(): void {
    this.events.on('message', (command: IMessageCommand) => {
      this.events.next('outgoingCommand', command);
    });
  }
}
