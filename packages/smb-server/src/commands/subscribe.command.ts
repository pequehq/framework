import { Injectable } from 'peque-di';
import { EventService, ICommandService, ISubscribeCommand } from 'peque-smb-commons/src';

import { SubscribeService } from '../services';

@Injectable()
export class SubscribeCommand implements ICommandService {
  constructor(private subscriptions: SubscribeService, private events: EventService) {
    this.init();
  }

  init(): void {
    this.events.on('subscribe', (command: ISubscribeCommand) =>
      this.subscriptions.set(command.action.topic, command.socketId),
    );
  }
}
