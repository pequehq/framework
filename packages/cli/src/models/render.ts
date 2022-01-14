import * as fs from 'fs';
import * as mustache from 'mustache';

export class RenderFile {
  render(template: string, data: unknown, output: string): void {
    const templateModel = fs.readFileSync(template, { encoding: 'utf-8' });
    const render = mustache.render(templateModel, data);
    fs.writeFileSync(`${process.cwd()}/${output}`, render, { encoding: 'utf-8' });
  }
}
