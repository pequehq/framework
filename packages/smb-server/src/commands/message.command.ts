import { Injectable } from 'peque-di';
import { ACommandService, IMessageCommand, IPublishCommand } from 'peque-smb-commons/src';

import { SubscribeService } from '../services';

@Injectable()
export class MessageCommand extends ACommandService<IMessageCommand> {
  constructor(private subscriptions: SubscribeService) {
    super();
    this.init();
  }

  init() {
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
