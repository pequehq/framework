import { Injectable } from '@peque/di';

import {
  CommandInvalidException,
  CommandNotMatchingException,
  CommandParsingException,
  ICommand,
  ICommandTypes,
} from '../../models';

@Injectable()
export class CommandParser {
  #validate(data: unknown): boolean {
    const validate = data as ICommand<ICommandTypes, never>;
    return !!validate.command && !!validate.socketId && !!validate.issueTimestamp && !!validate.action;
  }

  cast(data: unknown): ICommand<ICommandTypes, unknown> {
    if (this.#validate(data)) {
      return data as ICommand<ICommandTypes, unknown>;
    } else {
      throw new CommandInvalidException(JSON.stringify(data));
    }
  }

  stringify(data: ICommand<ICommandTypes, unknown>): string {
    return JSON.stringify(data);
  }

  parseCommand<T extends ICommand<ICommandTypes, unknown>>(data: string): T {
    let command;
    try {
      command = JSON.parse(data);
    } catch (error) {
      throw new CommandParsingException(data);
    }
    return this.cast(command) as T;
  }

  parseAndMatchCommand<T extends ICommand<ICommandTypes, unknown> = never>(command: ICommandTypes, data: string): T {
    const parsedCommand = this.parseCommand<T>(data);
    if (parsedCommand.command === command) {
      return parsedCommand;
    }
    throw new CommandNotMatchingException(data);
  }
}
