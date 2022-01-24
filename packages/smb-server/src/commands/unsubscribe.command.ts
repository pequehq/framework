import { Injectable } from 'peque-di';
import { ACommandService, IUnsubscribeCommand } from 'peque-smb-commons/src';

import { SubscribeService } from '../services';

@Injectable()
export class UnsubscribeCommand extends ACommandService {
  constructor(private subscriptions: SubscribeService) {
    super();
    this.init();
  }

  init(): void {
    this.events.on('unsubscribe', (command: IUnsubscribeCommand) =>
      this.subscriptions.unset(command.action.topic, command.socketId),
    );
  }
}
