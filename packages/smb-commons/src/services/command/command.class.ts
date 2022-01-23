import { Injectable } from 'peque-di';

import { ACommandService } from './command.abstract';
import { CommandEmitter } from './command-emitter.class';
import { CommandReceiver } from './command-receiver.class';

@Injectable()
export class Command {
  constructor(private commandReceiver: CommandReceiver, private commandEmitter: CommandEmitter) {}

  init(commands: ACommandService[]) {
    this.commandReceiver.init();
    this.commandEmitter.init();
    for (const command of commands) {
      command.init();
    }
  }
}
