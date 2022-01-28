import { Injectable } from '@peque/di';
import { EventService, ICommandService, IPublishCommand } from '@peque/smb-commons';

import { SubscribeListenerService } from '../services';

@Injectable()
export class PublishCommand implements ICommandService {
  constructor(private events: EventService, private subscriptions: SubscribeListenerService) {
    this.init();
  }

  init(): void {
    this.events.on('publish', async (command: IPublishCommand) => {
      const listeners = this.subscriptions.find(command.action.topic);
      await Promise.all(listeners);
    });
  }
}
