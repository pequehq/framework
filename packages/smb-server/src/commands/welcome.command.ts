import { Injectable } from 'peque-di';
import { ACommandService, IWelcomeCommand } from 'peque-smb-commons/src';

@Injectable()
export class WelcomeCommand extends ACommandService<IWelcomeCommand> {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.events.on('welcome', (command: IWelcomeCommand) => this.events.next('outgoingCommand', command));
  }
}
