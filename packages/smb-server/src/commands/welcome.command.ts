import { Injectable } from 'peque-di';
import { EventService, ICommandService, IWelcomeCommand } from 'peque-smb-commons/src';

@Injectable()
export class WelcomeCommand implements ICommandService {
  constructor(private events: EventService) {
    this.init();
  }

  init(): void {
    this.events.on('welcome', (command: IWelcomeCommand) => this.events.next('outgoingCommand', command));
  }
}
