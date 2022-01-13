import { CommandInterface } from '../models/command.interface';
import { GenerateCommand } from './generate.command';
import { InitCommand } from './init.command';
import { VersionCommand } from './version.command';

export type CommandType = 'generate' | 'init' | 'version';

export const Commands: Record<CommandType, CommandInterface> = {
  generate: new GenerateCommand(),
  init: new InitCommand(),
  version: new VersionCommand(),
};
