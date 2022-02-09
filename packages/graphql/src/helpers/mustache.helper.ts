import * as fs from 'fs';
import * as mustache from 'mustache';

export class MustacheHelper {
  constructor(private template: string) {}

  #getTemplate(): string {
    return fs.readFileSync(`${__dirname}/../templates/${this.template}`, { encoding: 'utf-8' });
  }

  render(object: unknown): string {
    return mustache.render(this.#getTemplate(), object);
  }
}
