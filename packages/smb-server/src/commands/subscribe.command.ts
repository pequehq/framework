import { Injectable } from 'peque-di';
import { ACommandService, ISubscribeCommand } from 'peque-smb-commons/src';

import { SubscribeService } from '../services';

@Injectable()
export class SubscribeCommand extends ACommandService {
  constructor(private subscriptions: SubscribeService) {
    super();
    this.init();
  }

  init() {
    this.events.on('subscribe', (command: ISubscribeCommand) =>
      this.subscriptions.set(command.action.topic, command.socketId),
    );
  }
}
