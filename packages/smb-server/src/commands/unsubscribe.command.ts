import { Injectable } from '@peque/di';
import { EventService, ICommandService, IUnsubscribeCommand } from '@peque/smb-commons';

import { SubscribeService } from '../services';

@Injectable()
export class UnsubscribeCommand implements ICommandService {
  constructor(private subscriptions: SubscribeService, private events: EventService) {
    this.init();
  }

  init(): void {
    this.events.on('unsubscribe', (command: IUnsubscribeCommand) =>
      this.subscriptions.unset(command.action.topic, command.socketId),
    );
  }
}
