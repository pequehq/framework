import { Injectable } from 'peque-di';
import { ACommandService, IWelcomeCommand } from 'peque-smb-commons/src';

@Injectable()
export class WelcomeCommand extends ACommandService {
  constructor() {
    super();
    this.init();
  }

  init(): void {
    this.events.on('welcome', (command: IWelcomeCommand) => this.events.next('outgoingCommand', command));
  }
}
