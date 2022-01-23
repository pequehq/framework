import { Injectable } from 'peque-di';
import { ACommandService, IPublishCommand } from 'peque-smb-commons/src';

@Injectable()
export class PublishCommand extends ACommandService<IPublishCommand> {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.events.on('publish', (command: IPublishCommand) => this.events.next('outgoingCommand', command));
  }
}
