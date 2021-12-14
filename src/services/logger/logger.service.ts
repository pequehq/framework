import { Injectable } from '../../decorators/injectable';
import { ExpressFactory } from '../../factory/express-factory';
import { LogLevelsType } from '../../models/interfaces/types';
import { EventData, EventManagerService } from '../events/event-manager.service';

interface LogEvent {
  level: LogLevelsType;
  data: any;
}

const LOG_LEVELS_MAPPING = {
  debug: { level: 'debug', order: 1 },
  error: { level: 'error', order: 2 },
  warn: { level: 'warn', order: 3 },
  info: { level: 'info', order: 4 },
};

const calculateLogLevel = (level: LogLevelsType) => LOG_LEVELS_MAPPING[level].order;

@Injectable()
export class LoggerService {
  constructor(private readonly eventManager: EventManagerService) {
    this.subscribe((value: EventData) => {
      const serverOptions = ExpressFactory.getServerOptions();
      if (
        serverOptions.logger &&
        calculateLogLevel(value.data.level) >= calculateLogLevel(serverOptions.logger.level)
      ) {
        if (serverOptions.logger.consoleOutput) {
          console[value.data.level](`[${value.data.timestamp}]`, `[${value.data.level}]`, value.data.data);
        }
      }
    });
  }

  log(event: LogEvent): void {
    this.eventManager.push('logger', { ...event, timestamp: Date.now() });
  }

  subscribe(listener: (...args: any[]) => void): void {
    this.eventManager.subscribe('logger', listener);
  }
}
