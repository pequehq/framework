import { Injectable } from '@peque/di';

import { EventService } from '../events/event.service';
import { SocketService } from '../socket/socket.service';
import { CommandParser } from './command-parser.class';

@Injectable()
export class CommandEmitter {
  constructor(private events: EventService, private commandParser: CommandParser, private sockets: SocketService) {}

  init(): void {
    this.events.on('outgoingCommand', (data) => {
      try {
        const command = this.commandParser.cast(data);
        this.sockets.get(command.socketId)?.write(this.commandParser.stringify(data));
      } catch (error) {
        this.events.next('error', error);
      }
    });
  }
}
