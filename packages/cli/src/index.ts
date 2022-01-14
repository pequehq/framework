#!/usr/bin/env node

import { program } from 'commander';

import { Commands, CommandType } from './commands/commands';

Object.keys(Commands).forEach((commandType: string) => {
  program.addOption(Commands[commandType].command());
});

program.parse();

const firstElement = Object.keys(program.opts())[0];
Commands[firstElement as CommandType].execute({ command: program.opts()[firstElement], args: program.args });
