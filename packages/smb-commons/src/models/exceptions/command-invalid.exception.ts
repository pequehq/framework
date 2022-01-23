export class CommandInvalidException extends Error {
  constructor(private command: string) {
    super();
    this.#config();
  }

  #config() {
    this.message = `The command is not valid: ${this.command}`;
  }
}
