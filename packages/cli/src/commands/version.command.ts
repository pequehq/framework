import { Option } from 'commander';

import pkg from '../../package.json';
import { CommandInterface, ExecuteOptions } from '../models/command.interface';

export class VersionCommand implements CommandInterface {
  command(): Option {
    return new Option('-v, --version', 'CLI version');
  }

  execute(options: ExecuteOptions): void {
    console.log('Peque.ts CLI version', pkg.version);
  }
}
