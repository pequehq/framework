export class CommandParsingException extends Error {
  constructor(private command: string) {
    super();
    this.#config();
  }

  #config() {
    this.message = `The command cannot be parsed: ${this.command}`;
  }
}
