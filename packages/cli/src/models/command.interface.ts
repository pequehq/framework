import { Option } from 'commander';

export interface ExecuteOptions {
  command: string;
  args: string[];
  metadata?: unknown;
}

export interface CommandInterface {
  command(): Option;
  execute(options: ExecuteOptions): void;
}
