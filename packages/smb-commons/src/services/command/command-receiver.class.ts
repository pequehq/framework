import { Injectable } from 'peque-di';

import { EventService } from '../events/event.service';
import { CommandParser } from './command-parser.class';

@Injectable()
export class CommandReceiver {
  constructor(private events: EventService, private commandParser: CommandParser) {}

  init(): void {
    this.events.on('incomingCommand', (data) => {
      try {
        const command = this.commandParser.parseCommand(data);
        this.events.next(command.command, command);
      } catch (error) {
        this.events.next('error', error);
      }
    });
  }
}
