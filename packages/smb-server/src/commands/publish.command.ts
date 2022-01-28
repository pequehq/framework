import { Injectable } from '@peque/di';
import { EventService, ICommandService, IPublishCommand } from '@peque/smb-commons';

@Injectable()
export class PublishCommand implements ICommandService {
  constructor(private events: EventService) {
    this.init();
  }

  init(): void {
    this.events.on('publish', (command: IPublishCommand) => this.events.next('outgoingCommand', command));
  }
}
