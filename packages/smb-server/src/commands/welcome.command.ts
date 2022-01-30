import { Injectable } from '@peque/di';
import { EventService, ICommandService, IWelcomeCommand } from '@peque/smb-commons';

@Injectable()
export class WelcomeCommand implements ICommandService {
  constructor(private events: EventService) {}

  init(): void {
    this.events.on('welcome', (command: IWelcomeCommand) => this.events.next('outgoingCommand', command));
  }
}
