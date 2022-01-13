import { Option } from 'commander';
import * as path from 'path';

import { CommandInterface, ExecuteOptions } from '../models/command.interface';

export class VersionCommand implements CommandInterface {
  command(): Option {
    return new Option('-v, --version', 'CLI version');
  }

  execute(options: ExecuteOptions): void {
    const version = require(path.join(__dirname, '../../package.json')).version;
    console.log('Peque.ts CLI version', version);
  }
}
