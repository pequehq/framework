import { Option } from 'commander';

import { CommandInterface, ExecuteOptions } from '../models/command.interface';
import { RenderFile } from '../models/render';
import { Metadata, Schemes, Templates } from '../schemas/schemes';
import { toPascalCase } from '../utils/utils';

export class GenerateCommand extends RenderFile implements CommandInterface {
  command(): Option {
    return new Option(
      '-g, --generate <type> <path>',
      'Generates a component (module, controller, service, interceptor, guard, transformer',
    );
  }

  execute(options: ExecuteOptions): void {
    const outPath = options.args[0];
    const className = toPascalCase(outPath.replace(/^.*[\\\/]/, ''));
    const templateData = options.metadata ? options.metadata : Schemes[options.command]();
    const metadata = Metadata[options.command](className, templateData);
    const template = Templates[options.command];

    this.render(template, metadata, outPath);
  }
}
