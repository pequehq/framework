import * as mustache from 'mustache';

export class MustacheHelper {
  constructor(private template: string) {}

  #getPath(): string {
    return `${__dirname}/../templates/${this.template}`;
  }

  render(object: unknown): string {
    return mustache.render(this.#getPath(), object);
  }
}
