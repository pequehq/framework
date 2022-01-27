export class CommandNotMatchingException extends Error {
  constructor(private command: string) {
    super();
    this.#config();
  }

  #config() {
    this.message = `The command is not matching: ${this.command}`;
  }
}
