import { Injectable } from 'peque-di';

import { CommandEmitter } from './command-emitter.class';
import { CommandReceiver } from './command-receiver.class';
import { ACommandService } from './command.abstract';

@Injectable()
export class Command {
  constructor(private commandReceiver: CommandReceiver, private commandEmitter: CommandEmitter) {}

  init(commands: ACommandService<unknown>[]) {
    this.commandReceiver.init();
    this.commandEmitter.init();
    for (const command of commands) {
      command.init();
    }
  }
}
