import { Injectable } from 'peque-di';
import { EventService, ICommandService, IMessageCommand, IPublishCommand } from 'peque-smb-commons';

import { SubscribeService } from '../services';

@Injectable()
export class MessageCommand implements ICommandService {
  constructor(private subscriptions: SubscribeService, private events: EventService) {
    this.init();
  }

  init(): void {
    this.events.on('message', (command: IMessageCommand) => {
      const subscribers = this.subscriptions.find(command.action.topic);
      for (const sub of subscribers) {
        const publishCommand: IPublishCommand = {
          command: 'publish',
          action: command.action,
          socketId: sub,
          issueTimestamp: Date.now(),
        };
        this.events.next('publish', publishCommand);
      }
    });
  }
}
