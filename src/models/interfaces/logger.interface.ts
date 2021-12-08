import { LogLevelsType } from './types';

export interface LoggerInterface {
  active: boolean;
  level: LogLevelsType;
  consoleOutput: boolean;
  engine: any;
}
