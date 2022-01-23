import { Injectable } from 'peque-di';

import {
  CommandInvalidException,
  CommandNotMatchingException,
  CommandParsingException,
  ICommand,
  ICommandTypes,
} from '../../models';

@Injectable()
export class CommandParser {
  // @TODO do validate before casting.
  cast(data: unknown): ICommand<ICommandTypes, unknown> {
    return data as ICommand<ICommandTypes, unknown>;
  }

  stringify(data: ICommand<ICommandTypes, unknown>): string {
    return JSON.stringify(data);
  }

  parseCommand<T = ICommand<ICommandTypes, unknown>>(data: string): T {
    try {
      return JSON.parse(data) as T;
    } catch (error) {
      throw new CommandParsingException(data);
    }
  }

  parseAndValidateCommand<T extends ICommand<ICommandTypes, unknown> = any>(command: ICommandTypes, data: string): T {
    const parsedCommand = this.parseCommand<T>(data);
    if (!parsedCommand) {
      throw new CommandInvalidException(data);
    }
    if (parsedCommand.command === command) {
      return parsedCommand;
    }
    throw new CommandNotMatchingException(data);
  }
}
