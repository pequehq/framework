import { Injectable } from 'peque-di';

import { ICommandService } from '../../models';
import { CommandEmitter } from './command-emitter.class';
import { CommandError } from './command-error.class';
import { CommandReceiver } from './command-receiver.class';

@Injectable()
export class Command {
  constructor(
    private commandError: CommandError,
    private commandReceiver: CommandReceiver,
    private commandEmitter: CommandEmitter,
  ) {}

  init(commands: ICommandService[]): void {
    this.commandError.init();
    this.commandReceiver.init();
    this.commandEmitter.init();
    for (const command of commands) {
      command.init();
    }
  }
}
